import axios from 'axios'
import CanvasCatchCoin from './canvasCatchCoin'

const RootAPI = 'https://event.shopping.friday.tw/playfullgift/Event20180536961Action.do?eventPage=game'
const ResStatusError = [201]

const resultLevel = function(score){
  switch (true) {
    case (score > 3600):
      return 5
      break
    case (score > 2000):
      return 4
      break
    case (score > 1200):
      return 3
      break
    case (score > 800):
      return 2
      break
    default:
      return 1
  }
}

const game = new CanvasCatchCoin()

game.option = {
  id: 'catchCoin',
  width: window.innerWidth,
  height: window.innerHeight,
  productionSpeed: 1,
  // backgroundImage: './images/bg.png',
  maxCoin: 10,
  minCoin: 3
}

game.basket = {
  width: 500 * 0.8,
  height: 447 * 0.8,
  file: './images/sprites/re_3.json',
  length: 2,
  speed: 300,
}

game.countBoard = {
  fontText: 'COUNT:',
  fontStyle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 60,
    fontFamily: 'Arvo',
    fill: '#3e1707',
    align: 'center',
    stroke: '#a4410e',
    strokeThickness: 7
  }
}

game.timer = {
  sec: 60,
  fontText: 'Time:',
  fontStyle: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 60,
    fontFamily: 'Arvo',
    fill: '#3e1707',
    align: 'center',
    stroke: '#a4410e',
    strokeThickness: 7
  }
}

game.coins = [
  {
    score: 100,
    file: './images/sprites/copper_1.json',
    length: 6,
    speed: 400,
    width: 10,
    height: 10,
    scale: 5
  },
  {
    score: 300,
    file: './images/sprites/silver_1.json',
    length: 6,
    speed: 500,
    scale: 3,
    action: function(){
      console.log('銀幣')
    }
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
  x: window.innerWidth - (206 * 2),
  y: window.innerHeight - 260,
  width: 206,
  height: 260,
  spacing: 0
}

game.gameOver = function(result){
  const { score } = result
  const level = resultLevel(score)

  alert(`你的分數為 ${score} ， 等級為 ${level}`)

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
