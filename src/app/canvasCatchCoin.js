import * as PIXI from 'pixi.js'
import keyCode from './keycode'

const app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  backgroundColor: 0x1099bb
})

class CanvasCatchCoin {

  constructor(opt = {}) {
    this.option = opt.option ? opt.option : {}
    this.coins = opt.option ? opt.option : []
    this.basket = opt.basket ? opt.basket : {}
    this.countBoard = opt.countBoard ? opt.countBoard : {}
  }

  // step
  init() {
    const {
      option
    } = this
    const {
      width,
      height
    } = option

    if (width) {
      app.view.width = width
    }

    if (height) {
      app.view.height = height
    }

    document.body.appendChild(app.view)
  }

  beforePIXILoader() {
    this.addLoaderCoins()
    this.addLoaderBasket()
  }

  onPIXILoader() {

    let { option } = this
    let { width, height } = option

    let t = 0
    let time = 1
    let lastSec = 0
    let score = 0

    let coins = this.createCoins()

    let basket = new Basket(this.basket)
    let basketAnim = basket.pixiAnimate

    let countBoard = new CountBoard(this.countBoard)
    let countBoardAnim = countBoard.pixiAnimate

    const catchCoinAnimate = function(delta) {

      t += delta
      const sec = Math.floor(t / app.ticker.FPS)

      if (sec >= 1 * time) {
        coins = coins.concat(this.createCoins())
        time++
      }

      for (let i = 0; i < coins.length; i++) {
        const {
          speed,
          action
        } = coins[i]

        const coinAnim = coins[i].pixiAnimate
        coinAnim.y += ((speed + coinAnim.gravity) * delta) / app.ticker.FPS

        if (coinAnim.y - coinAnim.height > height) {
          app.stage.removeChild(coinAnim)
          coins.splice(i, 1)
        }

        if (coinAnim.y > basketAnim.y &&
          coinAnim.x + (coinAnim.width / 2) > basketAnim.x &&
          coinAnim.x - (coinAnim.width / 2) < basketAnim.x + basketAnim.width
        ) {
          if (action) {
            action()
          }
          countBoardAnim.text = `${countBoard.fontText} ${score += coins[i].score}  `

          app.stage.removeChild(coinAnim)
          coins.splice(i, 1)
        }
      }
    }

    app.ticker.add(catchCoinAnimate.bind(this))
  }

  start() {
    this.init()

    this.beforePIXILoader()

    PIXI.loader.load(this.onPIXILoader.bind(this))
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

    pixiAnimate.x = Tool.createRandom(0 + pixiAnimate.width, window.innerWidth)
    pixiAnimate.y = pixiAnimate.height * -4

    pixiAnimate.gravity = Math.random()
    pixiAnimate.anchor.set(0.5)
    pixiAnimate.animationSpeed = 0.2
    pixiAnimate.scale.set(0.25 + Math.random() * 0.3)

    if (isSprite) {
      pixiAnimate.play()
    }

    app.stage.addChild(pixiAnimate)
  }
}

class Basket extends PixiImage {
  constructor(opt) {
    super(opt)

    const {
      pixiAnimate,
      width,
      height
    } = this

    pixiAnimate.width = width
    pixiAnimate.height = height
    pixiAnimate.x = window.innerWidth / 2 - width / 2
    pixiAnimate.y = window.innerHeight - height

    app.stage.addChild(pixiAnimate)

    window.addEventListener('keydown', function(e) {
      if (keyCode(e, 'left')) {
        if (pixiAnimate.x - 100 > 0) {
          pixiAnimate.x -= 100
        } else {
          pixiAnimate.x = 0
        }
      }

      if (keyCode(e, 'right')) {
        if (pixiAnimate.x + 100 + pixiAnimate.width < app.screen.width) {
          pixiAnimate.x += 100
        } else {
          pixiAnimate.x = app.screen.width - pixiAnimate.width
        }
      }
    })
  }
}

class CountBoard {
  constructor(opt= {}) {
    this.fontText = opt.fontText
    this.pixiOption = opt.pixiOption
    
    this.pixiAnimate = new PIXI.Text(`${this.fontText} 0  `, this.pixiOption)

    const { pixiAnimate } = this

    pixiAnimate.x = 0
    pixiAnimate.y = 0

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
