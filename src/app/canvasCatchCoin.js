import * as PIXI from 'pixi.js'
import keyCode from './keycode'

let app = {}

class CanvasCatchCoin {

  constructor(opt = {}) {
    this.option = opt.option ? opt.option : {}
    this.coins = opt.option ? opt.option : []
    this.basket = opt.basket ? opt.basket : {}
    this.countBoard = opt.countBoard ? opt.countBoard : {}
    this.timer = opt.timer ? opt.timer : {}
  }

  // init
  init() {
    const {
      option
    } = this

    const {
      id,
      width,
      height
    } = option

    app = new PIXI.Application(window.innerWidth, window.innerHeight, {
      backgroundColor: 0x1099bb
    })

    if (width) {
      app.view.width = width
    }

    if (height) {
      app.view.height = height
    }

    document.getElementById(id).appendChild(app.view)
  }

  // AddLoader
  addLoaderCoins() {
    const {
      coins
    } = this

    coins.map((item, idx) => {
      const {
        file,
        image
      } = item
      PIXI.loader.add(file ? file : image)
    })
  }

  addLoaderBasket() {
    const {
      basket
    } = this
    const {
      file,
      image
    } = basket
    PIXI.loader.add(file ? file : image)
  }

  // Coins
  createCoins() {
    let {
      coins
    } = this
    let prizeArr = []
    let arr = []
    let max = Tool.createRandom(3, 10)
    let total = 0

    for (let i = 0; i < coins.length; i++) {
      total += coins[i].scale
    }

    for (let i = 0; i < coins.length; i++) {

      let timer = (coins[i].scale / total) * max

      for (let t = 0; t < timer; t++) {
        arr.push(new Coin(coins[i]))
      }
    }

    return arr
  }

  // Event
  gameStop() {}

  // Action

  beforePIXILoader() {
    this.addLoaderCoins()
    this.addLoaderBasket()
  }

  onPIXILoader() {

    let {
      option
    } = this
    let {
      width,
      height
    } = option

    let numberExecutions = 1
    let deltaCount = 0
    let score = 0

    let coins = this.createCoins()

    let basket = new Basket(this.basket)
    basket.moveEvnet()

    let basketAnim = basket.pixiAnimate

    let countBoard = new CountBoard(this.countBoard)
    let countBoardAnim = countBoard.pixiAnimate

    let timer = new Timer(this.timer)
    let timerAnim = timer.pixiAnimate

    const catchCoinAnimate = function(delta) {

      deltaCount += delta
      const deltaSec = Math.floor(deltaCount / app.ticker.FPS)
      let isGameOver = timer.sec - deltaSec < 0

      basket.move(delta)


      // 固定時間內，加入新的一批 coin 的陣列
      if (deltaSec >= 1 * numberExecutions && !isGameOver) {

        timerAnim.text = `${timer.fontText} ${timer.sec - deltaSec} `

        // 提前 3 秒停止產生金幣
        if (!(timer.sec - deltaSec < 3)) {
          coins = coins.concat(this.createCoins())
        }

        numberExecutions++
      }

      for (let i = 0; i < coins.length; i++) {
        const {
          action
        } = coins[i]

        const coinAnim = coins[i].pixiAnimate

        coins[i].move(delta)

        // coin 物件於畫布外時，進行清除
        if (coinAnim.y - coinAnim.height > height) {
          app.stage.removeChild(coinAnim)
          coins.splice(i, 1)
        }

        // coin 於 basketAnim 範圍內時，觸發事件
        if (coinAnim.y > basketAnim.y &&
          coinAnim.x + (coinAnim.width / 2) > basketAnim.x &&
          coinAnim.x - (coinAnim.width / 2) < basketAnim.x + basketAnim.width &&
          !isGameOver
        ) {
          if (action) {
            action()
          }
          countBoardAnim.text = `${countBoard.fontText} ${score += coins[i].score}  `
          app.stage.removeChild(coinAnim)
          coins.splice(i, 1)
        }

        // 時間倒數結束時，停止動畫，且觸發事件
        if (isGameOver && coins.length === 0) {
          app.ticker.stop(catchCoinAnimate.bind(this))
          this.gameOver({
            score: score
          })
        }
      }
    }

    app.ticker.add(catchCoinAnimate.bind(this))
  }

  gameOver(result) {
    const {
      score
    } = result
    alert(`GAME OVER!! Your score is ${score} `)
  }

  start() {
    this.init()

    this.beforePIXILoader()

    PIXI.loader.load(this.onPIXILoader.bind(this))
  }
}

class PixiImage {
  constructor(opt) {
    this.width = opt.width
    this.height = opt.height
    this.image = opt.image
    this.file = opt.file
    this.length = opt.length
    this.pixiAnimate = this.file ? new PIXI.extras.AnimatedSprite(PIXITool.getSpriiteFrames(this.file, this.length)) : PIXI.Sprite.fromImage(this.image)
  }
}

class Coin extends PixiImage {
  constructor(opt) {
    super(opt)
    this.speed = opt.speed
    this.score = opt.score
    this.action = opt.action

    this.init()
  }

  init() {
    const {
      pixiAnimate,
      file,
      width,
      height
    } = this
    const isSprite = !!file

    if (width) {
      pixiAnimate.width = width
    }

    if (height) {
      pixiAnimate.height = height
    }

    pixiAnimate.x = Tool.createRandom(0 + pixiAnimate.width, app.screen.width - pixiAnimate.width)
    pixiAnimate.y = pixiAnimate.height * -4

    pixiAnimate.gravity = Math.random()
    pixiAnimate.anchor.set(0.5)
    pixiAnimate.rotation += 0.01
    pixiAnimate.animationSpeed = 0.2
    pixiAnimate.scale.set(0.25 + Math.random() * 0.3)

    if (isSprite) {
      pixiAnimate.play()
    }

    app.start()
    app.stage.addChild(pixiAnimate)
  }

  move(delta) {
    const {
      pixiAnimate,
      speed
    } = this
    pixiAnimate.y += ((speed + pixiAnimate.gravity) * delta) / app.ticker.FPS
  }
}

class Basket extends PixiImage {
  constructor(opt) {
    super(opt)
    this.speed = opt.speed
    this.isMoving = false
    this.position = ''
    this.init()
  }

  set setPosition(value) {
    this.position = value
  }

  init() {
    const {
      pixiAnimate,
      width,
      height
    } = this

    pixiAnimate.width = width
    pixiAnimate.height = height
    pixiAnimate.x = app.screen.width / 2 - width / 2
    pixiAnimate.y = app.screen.height - height

    app.stage.addChild(pixiAnimate)
  }

  move(delta) {
    const {
      pixiAnimate,
      speed
    } = this

    let {
      isMoving,
      position
    } = this

    // console.log(position,'position')

    if (position === 'right') {
      if (pixiAnimate.x + pixiAnimate.width < app.screen.width) {
        pixiAnimate.x += (speed * delta) / app.ticker.FPS
      }
    }

    if (position === 'left') {
      if (pixiAnimate.x > 0) {
        pixiAnimate.x -= (speed * delta) / app.ticker.FPS
      }
    }
  }

  moveEvnet() {

    let {
      position
    } = this

    window.addEventListener('keydown', function(e) {

      if (keyCode(e, 'left')) {
        this.setPosition = 'left'
      }

      if (keyCode(e, 'right')) {
        this.setPosition = 'right'
      }

    }.bind(this))

    window.addEventListener('deviceorientation', function(e) {
      const {
        alpha,
        beta,
        gamma
      } = e

      if(Math.floor(gamma) > 0){
        this.setPosition = 'right'
      }

      if(Math.floor(gamma) < 0){
        this.setPosition = 'left'
      }

    }.bind(this), false);
  }
}

class CountBoard {
  constructor(opt = {}) {
    this.fontText = opt.fontText
    this.fontStyle = opt.fontStyle

    this.pixiAnimate = new PIXI.Text(`${this.fontText} 0  `, this.fontStyle)

    const {
      pixiAnimate
    } = this

    pixiAnimate.x = 0
    pixiAnimate.y = 0

    app.stage.addChild(pixiAnimate)
  }
}

class Timer {
  constructor(opt = {}) {
    this.sec = opt.sec
    this.fontText = opt.fontText
    this.fontStyle = opt.fontStyle
    this.pixiAnimate = new PIXI.Text(`${this.fontText} ${this.sec}  `, this.fontStyle)

    this.init()
  }
  init() {
    const {
      pixiAnimate
    } = this

    pixiAnimate.x = 0
    pixiAnimate.y = 80

    app.stage.addChild(pixiAnimate)
  }
}

class PIXITool {
  static getSpriiteFrames(spriteJson, spriteLength) {

    let frames = []
    let fileName = spriteJson.match(/.+\/(.+)\.json/) ? spriteJson.match(/.+\/(.+)\.json/)[1] : ''

    for (let i = 0; i < spriteLength; i++) {
      frames.push(PIXI.Texture.fromFrame(fileName + i + '.png'))
    }

    return frames

  }
}

class Tool {
  static createRandom(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
  }
  static gcd(m, n) {
    return n === 0 ? m : this.gcd(n, m % n)
  }
}


export default CanvasCatchCoin
