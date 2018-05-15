import CanvasCatchCoin from './canvasCatchCoin'

const game = new CanvasCatchCoin()

game.option = {
  width: 600,
  height: 902,
  productionSpeed: 1,
  maxCoin: 6,
  minCoin: 3,
}

game.backgroundImages = [
  {
    image: './images/bg.png',
    width: 1848,
    height: 902
  }
]

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
  sec: 10,
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
  x: 600 - (206 * 2) - 10,
  y: 902,
  width: 206 * 0.5,
  height: 260 * 0.5,
  spacing: 10
}

game.closeButton = {
  image: './images/BtnClose.png'
}

game.gameOver = function(result){
  let {score} = result
  alert(`遊戲結束您的分數為： ${score}`)
}

window.addEventListener('load', function(){
  game.start()
})
