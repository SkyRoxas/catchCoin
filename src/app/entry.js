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
  timer: 1,
  productionSpeed: 1,
  dropSpeed: 1
}

game.basket = {
  width: 300,
  height: 204,
  image: './images/basket/basket.png',
  speed: 300,
  eventMode: 'kepress',
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
    image: './images/coin/coin_level1.png',
    speed: 200,
    width: 20,
    height: 20,
    scale: 5
  },
  {
    score: 300,
    image: './images/coin/coin_level2.png',
    speed: 300,
    width: 20,
    height: 20,
    scale: 1
  },
  {
    score: 500,
    file: './images/sprites/coin-rotate.json',
    length: 6,
    speed: 300,
    scale: 2
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
