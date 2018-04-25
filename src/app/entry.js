import CanvasCatchCoin from './canvasCatchCoin'

const game = new CanvasCatchCoin()

game.option = {
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
  speed: '',
  eventMode: 'kepress',
}

game.countBoard = {
  fontText: 'COUNT:',
  pixiOption: {
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
    score: 10,
    image: './images/coin/coin_level1.png',
    speed: 200,
    width: 20,
    height: 20,
    scale: 5
  },
  {
    score: 100,
    image: './images/coin/coin_level2.png',
    speed: 300,
    width: 20,
    height: 20,
    scale: 3,
    action: function(){
      console.log('銀幣')
    }
  },
  {
    score: 1000,
    file: './images/sprites/coin-rotate.json',
    length: 6,
    speed: 300,
    scale: 2
  }
]

window.addEventListener('load', function(){
  game.start()
})
