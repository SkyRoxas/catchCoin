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
  init() {
    const {
      width,
      height
    } = this
    this.app = new PIXI.Application(width, height, {
      backgroundColor: 0x1099bb
    })
    document.body.appendChild(this.app.view)
  }

  // Action Hook
  beforePIXILoader() {
    this.addLoaderCoins()
  }

  onPIXILoader() {
    this.animateCoins()
  }

  // Coins
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

  createCoins() {
    let {
      coins
    } = this
    let prizeArr = []
    let arr = []
    let max = Tool.createRandom(3, 10)
    let total = 0

    for (var i = 0; i < coins.length; i++) {
      total += coins[i].scale
    }

    for (var i = 0; i < coins.length; i++) {

      let timer = (coins[i].scale / total) * max

      for (var t = 0; t < timer; t++) {
        arr.push(new Coin(coins[i]))
      }
    }

    return arr
  }

  animateCoins() {
    let {
      app,
      coins,
      width,
      height
    } = this

    for (var i = 0; i < 20; i++) {

      setTimeout(() => {

        let debugTime = 0


        let coins = this.createCoins()

        for (let i = 0; i < coins.length; i++) {
          const coinAnim = coins[i].pixiAnimate

          const {
            file,
            width,
            height,
            speed
          } = coins[i]

          const isSprite = !!file

          if (width) {
            coinAnim.width = width
          }

          if (height) {
            coinAnim.height = height
          }

          coinAnim.x = Tool.createRandom(0 + coinAnim.width, this.width - coinAnim.width)
          coinAnim.y = coinAnim.height * -3

          coinAnim.gravity = Math.random()
          coinAnim.anchor.set(0.5)
          coinAnim.animationSpeed = 0.2
          coinAnim.scale.set(0.25 + Math.random() * 0.3)

          if (isSprite) {
            coinAnim.play()
          }

          app.stage.addChild(coinAnim)
        }

        const coinDrop = function(delta) {

          let statue = false

          for (var i = 0; i < coins.length; i++) {
            const {
              speed,
              action
            } = coins[i]

            const coinAnim = coins[i].pixiAnimate
            coinAnim.y += ((speed + coinAnim.gravity) * delta) / app.ticker.FPS
            coinAnim.rotation += 0.01


            if (coinAnim.y > height) {
              action()
              coinAnim.y = 100
              app.stage.removeChild(coinAnim)
              coins.splice(i, 1)
            }
          }
        }

        app.ticker.add(coinDrop)



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
  constructor(opt) {
    this.name = opt.name
    this.width = opt.width
    this.height = opt.height
    this.image = opt.image
    this.file = opt.file
    this.length = opt.length
    this.speed = opt.speed
    this.action = opt.action
    this.pixiAnimate = this.file ? new PIXI.extras.AnimatedSprite(PIXITool.getSpriiteFrames(this.file, this.length)) : PIXI.Sprite.fromImage(this.image)
  }
}

class PIXITool {
  static getSpriiteFrames(spriteJson, spriteLength) {

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
  static gcd(m, n) {
    return n === 0 ? m : this.gcd(n, m % n)
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
