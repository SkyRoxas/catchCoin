import axios from 'axios'
import CanvasCatchCoin from './canvasCatchCoin'


// catchCoin

const RootAPI = 'https://event.shopping.friday.tw/playfullgift/Event20180536961Action.do?eventPage=game'
const ResStatusError = []

const readyLoad = function(callback){
  if(document.readyState === 'complete'){
    callback()
  } else {
    window.addEventListener('load', function(){
      callback()
    })
  }
}

const resultLevel = function(score){
  switch (true) {
    case (score > 12000):
      return 5
      break
    case (score > 8000):
      return 4
      break
    case (score > 6000):
      return 3
      break
    case (score > 4000):
      return 2
      break
    default:
      return 1
  }
}

const game = new CanvasCatchCoin()

const domShow = function(){
  if(document.getElementsByClassName('Idol')[0]){
      document.getElementsByClassName('Idol')[0].style.display = 'block'
  }

  if(document.getElementById('coin_rain_icon')){
      document.getElementById('coin_rain_icon').style.display = 'block'
  }
}

const domHidden = function(){
  if(document.getElementsByClassName('Idol')[0]){
      document.getElementsByClassName('Idol')[0].style.display = 'none'
  }

  if(document.getElementById('coin_rain_icon')){
      document.getElementById('coin_rain_icon').style.display = 'none'
  }
}

let scale = window.innerHeight / window.innerWidth // 寬高比例
let isHeightBetterWidth = window.innerHeight > window.innerWidth

let canvasWidth = 1440 //實際寬度
let canvasHeight = isHeightBetterWidth ? (canvasWidth * scale) : window.innerHeight

game.option = {
  // id: 'catchCoin',
  width: canvasWidth,
  height: canvasHeight,
  productionSpeed: 1,
  transparent: true,
  // backgroundImage: './images/bg.png',
  maxCoin: 6,
  minCoin: 3
}

game.basket = {
  width: isHeightBetterWidth ? (530 * 0.5 * scale) : 530 * 0.5,
  height: isHeightBetterWidth ? (1020 * 0.5 * scale) : 1020 * 0.5,
  file: 'https://shoppingplus-static.friday.tw/campian/coinsrain/images/sprites/re_4.json',
  length: 2,
  speed: isHeightBetterWidth ? 300 : (300 * scale),
}

game.countBoard = {
  fontText: 'counts :',
  x: isHeightBetterWidth ? canvasWidth - (500 * scale) : canvasWidth - 500,
  y: isHeightBetterWidth ? (70 * scale) : 70,
  fontStyle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: isHeightBetterWidth ? (35 * scale) : 35,
    fontFamily: 'Arvo',
    fill: '#fff',
    align: 'center',
    stroke: '#fff',
    // strokeThickness: 7
  }
}

game.timer = {
  sec: 25,
  x: isHeightBetterWidth ? canvasWidth - (500 * scale) : canvasWidth - 500,
  y: isHeightBetterWidth ? (120 * scale) : 120,
  fontText: 'seconds :',
  fontStyle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: isHeightBetterWidth ? (35 * scale) : 35,
    fontFamily: 'Arvo',
    fill: '#fff',
    align: 'center',
    stroke: '#fff',
    // strokeThickness: 7
  }
}

game.coins = [
  {
    score: 100,
    file: 'https://shoppingplus-static.friday.tw/campian/coinsrain/images/sprites/copper_1.json',
    length: 6,
    speed: 400,
    scale: 5
  },
  {
    score: 300,
    file: 'https://shoppingplus-static.friday.tw/campian/coinsrain/images/sprites/silver_1.json',
    length: 6,
    speed: 500,
    scale: 3
  },
  {
    score: 500,
    file: 'https://shoppingplus-static.friday.tw/campian/coinsrain/images/sprites/golden_1.json',
    length: 6,
    speed: 600,
    scale: 2
  }
]

game.controller = {
  leftImage: 'https://shoppingplus-static.friday.tw/campian/coinsrain/images/controller/left.png',
  rightImage: 'https://shoppingplus-static.friday.tw/campian/coinsrain/images/controller/right.png',
  x: (canvasWidth - (136 * 2)) - 100,
  y: canvasHeight - 104 - 30,
  width: 136,
  height: 104,
  spacing: 20
}

game.closeButton = {
  image: 'https://shoppingplus-static.friday.tw/campian/coinsrain/images/BtnClose.png',
  width: isHeightBetterWidth ? (75 * scale) : 75,
  heigth: isHeightBetterWidth ? (75 * scale) : 75,
  action: function(){
    domShow()
  }
}

game.pixiImages = [
  {
    x: isHeightBetterWidth ? canvasWidth - (530 * scale) : canvasWidth - 530,
    y: 0,
    image: 'https://shoppingplus-static.friday.tw/campian/coinsrain/images/countborad.png',
    width: isHeightBetterWidth ? (330 * scale) : 330,
    height: isHeightBetterWidth ? (240 * scale) : 240
  }
]

game.gameOver = function(result){
  const { score } = result
  const level = resultLevel(score)

  const action = axios.create({
   withCredentials: true,
   params: {
        score: score,
        level: level
      }
    })

  action.post(RootAPI)
  .then( res => {
    if( ResStatusError.indexOf(res.status) !== -1) {
      throw new Error('Network response was not ok.')
    }
  })
  .catch( () => {
    console.log('error')
    localStorage.setItem('gameResult', JSON.stringify(
      {
        score: score,
        level: level
      }
    ))
  })

  console.log(`分數 ${score} : ${level} 星`)

  domShow()

}

readyLoad(game.start.bind(game))

// remind

const domStr = `
  <div class="Lightbox">
  	<div class="LightboxOverlay"></div>
  	<div class="LightboxWrap Guid">
  			<div class="Content">
  				<div class="BtnClose"><a href="javascript:void(0);" title="關閉">關閉</a></div>
  				<div class="Information">
  					<div class="TimeSet"><span class="timer"></span>秒</div>
  					<label class="container">
  						<input type="checkBox" name="checkBox">
  						<span class="checkmark"></span>我已了解遊戲規則，不用再提醒。
  					</label>
  				</div>
  			</div>
  	</div>
  </div>
`

const closeRemind = ()=>{

  if(!document.querySelector('input[name="checkBox"]')){
    return
  }

  let checkBoxDOM = document.querySelector('input[name="checkBox"]')

  if(checkBoxDOM.checked){
    localStorage.setItem('catchCoinRemind', true)
  }
  document.body.removeChild(document.querySelector('.Lightbox'))
}

class Timer {
  constructor(sec){
    this.sec = sec
  }
  set setSec(sec) {
    this.sec = sec
    if(!document.querySelector('.Lightbox .timer')){
      return
    }
    document.querySelector('.Lightbox .timer').innerHTML = this.sec
  }
}

readyLoad(function(){

  if(localStorage.getItem('catchCoinRemind')) {
    return
  }

  document.body.insertAdjacentHTML('beforeend', domStr)

  let i = 1
  const lightboxTimer = new Timer(5)

  const animate = setInterval(function(){
    lightboxTimer.setSec = 5 - i
    i++
    if(lightboxTimer.sec > 0) {
      return
    }
    closeRemind()
    clearInterval(animate)
  }, 1000)

  document.querySelector('.BtnClose').addEventListener('click', function(){
    closeRemind()
  })

})

readyLoad(function(){
  domHidden()
})
