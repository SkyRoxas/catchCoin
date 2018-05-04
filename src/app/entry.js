import axios from 'axios'
import CanvasCatchCoin from './canvasCatchCoin'


// catchCoin

const RootAPI = 'https://event.shopping.friday.tw/playfullgift/Event20180536961Action.do?eventPage=game'
const ResStatusError = [201]

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

const canvasWidth = window.innerWidth > 1200 ? 1200 : window.innerWidth

game.option = {
  // id: 'catchCoin',
  width: canvasWidth,
  height: window.innerHeight,
  productionSpeed: 1,
  transparent: true,
  // backgroundImage: './images/bg.png',
  maxCoin: 6,
  minCoin: 3
}

game.basket = {
  width: 530 * 0.5,
  height: 1020 * 0.5,
  file: './images/sprites/re_4.json',
  length: 2,
  speed: 300,
}

game.countBoard = {
  fontText: 'seconds :',
  x: canvasWidth - 500,
  y: 70,
  fontStyle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 35,
    fontFamily: 'Arvo',
    fill: '#fff',
    align: 'center',
    stroke: '#fff',
    // strokeThickness: 7
  }
}

game.timer = {
  sec: 25,
  x: canvasWidth - 500,
  y: 120,
  fontText: 'counts :',
  fontStyle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 35,
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
    file: './images/sprites/copper_1.json',
    length: 6,
    speed: 400,
    scale: 5
  },
  {
    score: 300,
    file: './images/sprites/silver_1.json',
    length: 6,
    speed: 500,
    scale: 3
  },
  {
    score: 500,
    file: './images/sprites/golden_1.json',
    length: 6,
    speed: 600,
    scale: 2
  }
]

game.controller = {
  leftImage: './images/controller/left.png',
  rightImage: './images/controller/right.png',
  x: (canvasWidth - (136 * 2)) - 100,
  y: window.innerHeight - 104 - 30,
  width: 136,
  height: 104,
  spacing: 20
}

game.closeButton = {
  image: './images/BtnClose.png'
}

game.pixiImages = [
  {
    x: canvasWidth - 530,
    y: 0,
    image: './images/countborad.png',
  }
]

game.gameOver = function(result){
  const { score } = result
  const level = resultLevel(score)

  axios.post(RootAPI, {
    score: score,
    level: level
  })
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
}

window.addEventListener('load', function(){
  game.start()
})

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
    document.querySelector('.Lightbox .timer').innerHTML = this.sec
  }
}

window.addEventListener('load', function(){

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
