import * as PIXI from './pixi.min.js'
import keyCode from './keycode'

let app = {}

class CanvasCatchCoin {

  constructor(opt = {}) {
    this.option = opt.option || {}
    this.coins = opt.option || []
    this.basket = opt.basket || {}
    this.countBoard = opt.countBoard || {}
    this.timer = opt.timer || {}
    this.controller = opt.controller || {}
    this.closeButton = opt.closeButton || {}
    this.backgroundImages = opt.backgroundImages || []
  }

  // init
  init() {
    const { option } = this
    const { id, width, height, transparent } = option

    app = new PIXI.Application(width, height, {
      transparent
    })

    if (width) {
      app.view.width = width
    }

    if (height) {
      app.view.height = height
    }

    if(id){
      document.getElementById(id).appendChild(app.view)
      return
    }
    document.body.appendChild(app.view)
  }

  // AddLoader

  addLoaderCloseButton() {
    const { closeButton } = this
    const { image } = closeButton
    if ( image ){
      PIXI.loader.add(image)
    }
  }

  addLoaderCoins() {
    const { coins } = this

    coins.map(item => {
      const { file, image } = item
      PIXI.loader.add(file ? file : image)
    })
  }

  addLoaderBasket() {
    const { basket } = this
    const { file, image } = basket
    PIXI.loader.add(file ? file : image)
  }

  addLoaderController() {
    const { controller } = this
    const { leftImage, rightImage } = controller
    if( leftImage ) {
      PIXI.loader.add(leftImage)
    }
    if( rightImage ){
      PIXI.loader.add(rightImage)
    }
  }

  addLoaderBackgroundImages() {
    let { backgroundImages } = this
    for (let i = 0; i < backgroundImages.length; i++) {
      let {file, image} = backgroundImages[i]
      PIXI.loader.add(file ? file : image)
    }
  }

  // static backgroundImages
  createPixiImages() {
    let { backgroundImages } = this
    console.log(backgroundImages)
    for (let i = 0; i < backgroundImages.length; i++) {

      let pixiImage = new PixiImage(backgroundImages[i])

      let {pixiAnimate, file, x, y, width, height} = pixiImage
      let isSprite = !!file

      pixiAnimate.x = x
      pixiAnimate.y = y
      pixiAnimate.zOrder = 10

      if( width ) {
        pixiAnimate.width = width
      }

      if ( height ) {
        pixiAnimate.height = height
      }

      if(isSprite){
        pixiAnimate.animationSpeed = 0.2
        pixiAnimate.play()
      }

      app.stage.addChild(pixiAnimate)
    }
  }

  // Coins
  createCoins() {

    let { coins, option } = this
    let {maxCoin, minCoin} = option

    maxCoin = maxCoin ? maxCoin : 10
    minCoin = minCoin ? minCoin : 3

    let arr = []
    let max = Tool.createRandom(minCoin, maxCoin)
    let total = 0

    for (let i = 0; i < coins.length; i++) {
      total += coins[i].scale
    }

    for (let i = 0; i < coins.length; i++) {
      let timer = (coins[i].scale / total) * max
      for (let t = 0; t < timer; t++) {
        coins[i].startFrame = Tool.createRandom(0, coins[i].length)
        arr.push(new Coin(coins[i]))
      }
    }

    return arr
  }

  // Action
  beforePIXILoader() {
    this.addLoaderCoins()
    this.addLoaderBasket()
    this.addLoaderController()
    this.addLoaderCloseButton()
    this.addLoaderBackgroundImages()
  }

  onPIXILoader() {

    let { option } = this
    let { height, productionSpeed } = option

    productionSpeed = productionSpeed ? productionSpeed : 1

    this.createPixiImages()

    let coins = this.createCoins()
    let basket = new Basket(this.basket)
    let timer = new Timer(this.timer)
    let countBoard = new CountBoard(this.countBoard)
    let controller = new Controller(this.controller)

    console.log(this.closeButton)
    let closeButton = new CloseButton(this.closeButton)

    let basketAnim = basket.pixiAnimate
    let countBoardAnim = countBoard.pixiAnimate
    let timerAnim = timer.pixiAnimate

    // 起始狀態資料
    let numberExecutions = 1
    let score = 0
    let startSecond = Date.now()

    // 遊戲結束條件
    let isTimeUp = false
    let isSuddenOver = false

    basket.moveEvnet()
    controller.moveEvent(basket)
    closeButton.closeEvent(this)


    const animate = function(delta) {

      let nowSecond = Date.now()

      const sec = Math.floor((nowSecond - startSecond) / 1000)

      isTimeUp = timer.sec - sec < 0

      let isGameOver = isTimeUp || isSuddenOver

      basket.move(delta)

      if(!isGameOver){
        timerAnim.text = `${timer.fontText} ${timer.sec - sec} `
      }


      // 固定時間內，加入新的一批 coin 的陣列
      if (sec >= 1 * numberExecutions && !isGameOver) {

        // 提前 2 秒停止產生金幣，與產生金幣的頻率
        if (!(timer.sec - sec < 2) && numberExecutions % productionSpeed === 0) {
          coins = coins.concat(this.createCoins())
        }

        numberExecutions++
      }

      for (let i = 0; i < coins.length; i++) {

        const { action } = coins[i]
        const coinAnim = coins[i].pixiAnimate

        coins[i].move(delta)

        // coin 物件於畫布外時，進行清除
        if (coinAnim.y - coinAnim.height > height) {
          app.stage.removeChild(coinAnim)
          coins.splice(i, 1)
        }

        // coin 於 basketAnim 範圍內時，觸發事件
        if (coinAnim.y > basketAnim.y &&
            coinAnim.y < basketAnim.y + (basketAnim.height * 0.5) &&
            coinAnim.x + (coinAnim.width / 2) > basketAnim.x &&
            coinAnim.x - (coinAnim.width / 2) < basketAnim.x + basketAnim.width &&
            !isGameOver
        ) {
          if (action) {
            const game = {
              score: this.score,
              stopGame() {
                isSuddenOver = true
                if (isGameOver && coins.length === 0) {
                  app.ticker.stop(animate.bind(this))
                  this.gameOver({ score: score })
                }
              }
            }
            action(game)
          }
          countBoardAnim.text = `${countBoard.fontText} ${score += coins[i].score}  `
          app.stage.removeChild(coinAnim)
          coins.splice(i, 1)
        }
      }

      // 時間倒數結束時，停止動畫，且觸發事件
      if(coins.length === 0){
        app.ticker.stop(animate.bind(this))
        this.gameOver({
          score: score
        })
      }

    }

    app.ticker.add(animate.bind(this))
  }

  gameOver(result) {
    const { score } = result
    console.log(`GAME OVER!! Your score is ${score} `)
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
    this.x = opt.x || 0
    this.y = opt.y || 0
    this.image = opt.image
    this.file = opt.file
    this.length = opt.length
    this.startFrame = opt.startFrame
    this.pixiAnimate = this.file ? new PIXI.extras.AnimatedSprite(PIXITool.getSpriiteFrames(this.file, this.length, this.startFrame)) : PIXI.Sprite.fromImage(this.image)
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
    const { pixiAnimate, file, width, height } = this
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
    pixiAnimate.animationSpeed = 0.2
    pixiAnimate.scale.set(0.5 + Math.random() * 0.35)

    if (isSprite) {
      pixiAnimate.play()
    }

    app.start()
    app.stage.addChild(pixiAnimate)
  }

  move(delta) {
    const { pixiAnimate, speed } = this
    pixiAnimate.y += ((speed + pixiAnimate.gravity) * delta) / app.ticker.FPS
    pixiAnimate.anchor.set(0.5)
    pixiAnimate.rotation += 0.01
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

  init() {
    const { pixiAnimate, width, height } = this

    if( width ) {
      pixiAnimate.width = width
    }

    if ( height ) {
      pixiAnimate.height = height
    }

    pixiAnimate.x = app.screen.width / 2 - width / 2
    pixiAnimate.y = app.screen.height - height

    app.stage.addChild(pixiAnimate)
  }

  move(delta) {
    const { pixiAnimate, speed, file } = this
    let { position, isMoving } = this
    let isSprite = !!file

    if (position === 'right') {
      if (pixiAnimate.x + pixiAnimate.width < app.screen.width) {
        pixiAnimate.x += (speed * delta) / app.ticker.FPS
        pixiAnimate.scale.x = Math.abs(pixiAnimate.scale.x) * -1
        pixiAnimate.anchor.set(1, 0)
      }
    }

    if (position === 'left') {
      if (pixiAnimate.x > 0) {
        pixiAnimate.x -= (speed * delta) / app.ticker.FPS
        pixiAnimate.scale.x = Math.abs(pixiAnimate.scale.x)
        pixiAnimate.anchor.set(0, 0)
      }
    }

    if(!isSprite) {
      return
    }

    if(position) {
      this.isMoving = true
    }

    if(isMoving) {
      pixiAnimate.animationSpeed = 0.1
      pixiAnimate.play()
    }
  }

  moveEvnet() {

    window.addEventListener('keydown', function(e) {

      if (keyCode(e, 'left')) {
        this.position = 'left'
      }

      if (keyCode(e, 'right')) {
        this.position = 'right'
      }

    }.bind(this))

    window.addEventListener('deviceorientation', function(e) {
      const { gamma } = e

      if(Math.floor(gamma) > 0){
        this.position = 'right'
      }

      if(Math.floor(gamma) < 0){
        this.position = 'left'
      }

    }.bind(this), false)
  }
}

class Controller{
  constructor(opt){
    this.x = opt.x || 0
    this.y = opt.y || 0
    this.width = opt.width
    this.height = opt.height
    this.spacing = opt.spacing || 0
    this.leftImage = opt.leftImage
    this.rightImage = opt.rightImage
    this.leftButton = PIXI.Sprite.fromImage(this.leftImage)
    this.rightButton = PIXI.Sprite.fromImage(this.rightImage)
    this.init()
  }
  init(){
    const { leftButton, rightButton, width, height, x, y, spacing } = this

    let arr = [leftButton, rightButton]

    arr.map(el => {
      el.x = x
      el.y = y

      el.interactive = true
      el.buttonMode = true

      if( width ) {
        el.width = width
      }
      if ( height ) {
        el.height = height
      }
    })

    rightButton.x = leftButton.width + spacing + x

    if(!('ontouchstart' in window)){
      app.stage.addChild(rightButton)
      app.stage.addChild(leftButton)
    }
  }
  moveEvent(basket){
    const { leftButton, rightButton } = this

    leftButton.on('click', function(){
      basket.position = 'left'
    })

    rightButton.on('click', function(){
      basket.position = 'right'
    })
  }
}

class CountBoard {
  constructor(opt = {}) {
    this.fontText = opt.fontText
    this.fontStyle = opt.fontStyle
    this.x = opt.x ? opt.x : 0
    this.y = opt.y ? opt.y : 0
    this.pixiAnimate = new PIXI.Text(`${this.fontText} 0  `, this.fontStyle)

    const {x, y, pixiAnimate } = this

    pixiAnimate.x = x
    pixiAnimate.y = y

    app.stage.addChild(pixiAnimate)
  }
}

class Timer {
  constructor(opt = {}) {
    this.sec = opt.sec
    this.fontText = opt.fontText
    this.fontStyle = opt.fontStyle
    this.x = opt.x ? opt.x : 0
    this.y = opt.y ? opt.y : 80
    this.pixiAnimate = new PIXI.Text(`${this.fontText} ${this.sec}  `, this.fontStyle)

    this.init()
  }
  init() {
    const {x, y, pixiAnimate } = this

    pixiAnimate.x = x
    pixiAnimate.y = y

    app.stage.addChild(pixiAnimate)
  }
}

class CloseButton extends PixiImage {
  constructor(opt){
    super(opt)
    this.x = opt.x || app.screen.width - this.pixiAnimate.width
    this.y = opt.y || 0
    this.width = opt.width
    this.height = opt.height
    this.init()
  }
  init(){
    const {pixiAnimate, x, y, width, height} = this
    pixiAnimate.interactive = true
    pixiAnimate.x = x
    pixiAnimate.y = y

    if( width ) {
      pixiAnimate.width = width
    }
    if ( height ) {
      pixiAnimate.height = height
    }

    app.stage.addChild(pixiAnimate)
  }
  closeEvent(catchCoinProps){
    let { pixiAnimate } = this
    let { option } = catchCoinProps
    let { id } = option
    let buttonEvent = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click'
    pixiAnimate.on(buttonEvent, function(){
      app.stop()
      if(id){
        document.querySelector(id).removeChild(app.view)
      }else {
        document.body.removeChild(app.view)
      }
    })
  }
}

class PIXITool {
  static getSpriiteFrames(spriteJson, spriteLength, startIndex) {

    let frames = []
    let fileName = spriteJson.match(/.+\/(.+)\.json/) ? spriteJson.match(/.+\/(.+)\.json/)[1] : ''

    startIndex = startIndex || 0
    let index = 0

    for (let i = 0; i < spriteLength; i++) {
      if (startIndex >= spriteLength) {
        index = Math.abs(spriteLength - startIndex)
      }else {
        index = startIndex
      }
      startIndex++
      frames.push(PIXI.Texture.fromFrame(fileName + index + '.png'))
    }
    return frames

  }

  static backgroundCover(pxixSprite) {
    let containerWidth = app.screen.width
    let containerHeight = app.screen.height
    let imageRatio = pxixSprite.width / pxixSprite.height
    let containerRatio = containerWidth / containerHeight

    if(containerRatio > imageRatio) {
      pxixSprite.height = pxixSprite.height / (pxixSprite.width / containerWidth)
      pxixSprite.width = containerWidth
      pxixSprite.position.x = 0
      pxixSprite.position.y = (containerHeight - pxixSprite.height) / 2
    }else{
      pxixSprite.width = pxixSprite.width / (pxixSprite.height / containerHeight)
      pxixSprite.height = containerHeight
      pxixSprite.position.y = 0
      pxixSprite.position.x = (containerWidth - pxixSprite.width) / 2
    }
  }
}

class Tool {
  static createRandom(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min)
  }
}

if(window.CanvasCatchCoin === undefined){
  window.CanvasCatchCoin = CanvasCatchCoin
}else {
  throw new Error('CanvasCatchCoin is ready defined on the window')
}

export default CanvasCatchCoin
