import * as PIXI from 'pixi.js'

class CanvasCatchCoin {

  constructor(opt) {
    this.width = opt.width
    this.height = opt.height
    this.timer = opt.timer
    this.productionSpeed = opt.productionSpeed
    this.dropSpeed = opt.dropSpeed
    this.eventMode = opt.eventMode
    this.coins = opt.coins
  }

  // Init
  init () {
    const {width, height} = this
    this.app = new PIXI.Application(width, height, {
      backgroundColor: 0x1099bb
    })
    document.body.appendChild(this.app.view)
  }

  // Action Hook

  beforePIXILoader () {
    this.addLoaderCoins()
  }

  onPIXILoader () {
    this.animateCoin()
  }

  // Coins

  addLoaderCoins () {
    const {coins} = this

    coins.map((item, idx) => {
      const {file} = item
      PIXI.loader.add(file)
    })
  }

  createCoins() {
    let {coins} = this
    let {file, length} = coins[0]
    let arr = []
    for (var i = 0; i < 10; i++) {
      arr.push(new Coin(coins[0]))
    }
    return arr
  }

  animateCoin(){
    let { app, coins } = this
    for (var i = 0; i < 1; i++) {

      setTimeout(() => {

        let items = this.createCoins()

        for(let i = 0; i < items.length; i++) {
          const coinAnim = items[i].pixiAnimate
          coinAnim.x = 100 + (i * 100)
          coinAnim.y = 100
          coinAnim.gravity = Math.random()
          coinAnim.anchor.set(0.5)
          coinAnim.animationSpeed = 0.2
          coinAnim.scale.set(0.35 + Math.random() * 0.5)
          coinAnim.play()
          app.stage.addChild(coinAnim)
        }
        console.log(items[0].pixiAnimate.x)
        console.log(items[1].pixiAnimate.x)
        console.log(items[2].pixiAnimate.x)
        console.log(items[3].pixiAnimate.x)

        // app.ticker.add(function() {
        //   for (var i = 0; i < items.length; i++) {
        //     items[i].y += 2 + items[i].gravity
        //     items[i].rotation += 0.01
        //   }
        // })
      }, i * 1000)
    }
  }

  // Catch

  // Run Code Function
  start() {
    this.init()

    this.beforePIXILoader()

    PIXI.loader.load(() => {
      this.onPIXILoader()
    })

  }

  // Set Props
  set setCoins(arr) {
    this.coins = arr
  }
}

class Coin {
  constructor(opt){
    this.name = opt.name
    this.file = opt.file
    this.length = opt.length
    this.action = opt.action
  }
  get pixiAnimate() {
    let {file, length} = this
    return new PIXI.extras.AnimatedSprite(PIXITool.getSpriiteFrames(file, length))
  }
}

class PIXITool {
  static getSpriiteFrames(spriteJson, spriteLength){

    let frames = []
    let fileName = spriteJson.match(/.+\/(.+)\.json/) ? spriteJson.match(/.+\/(.+)\.json/)[1] : ''

    for (var i = 0; i < spriteLength; i++) {
      frames.push(PIXI.Texture.fromFrame(fileName + i + '.png'))
    }

    return frames

  }
}

class Tool {
  static createRandom(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
  }
}


export default CanvasCatchCoin

// 整體設定
//
// 遊戲時間 （秒）
// 生產金幣時間頻率 （秒）
// 金幣掉落速度 （秒）
// 每次金幣產生的上限數量
// 操作模式： kepress, mouse, touch, deviceorientation (陀螺儀)

// 金幣物件
//
// 名稱
// 觸發事件
// 背景圖片
// 下降速率
// 出現比例
//
//
// 將有 file 參數的物件 存取為 sprite 物件  （實作 實例 sprite 物件）
// 實作一個執行金幣動畫的 function ， 且需隨機性的實例化需執行動畫的物件
//

const option = {
  timer: 1,
  productionSpeed: 1,
  dropSpeed: 1,
  eventMode: 'kepress'
}

const coin = {
  name: '1',
  widht: '10px',
  height: '10px',
  background: './images/01.png',
  dropSpeedMultiple: 1,
  scale: 1
}
