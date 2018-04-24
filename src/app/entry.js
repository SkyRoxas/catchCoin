import CanvasCatchCoin from './canvasCatchCoin'


const game = new CanvasCatchCoin(
  {
    width: 960,
    height: 720,
    timer: 1,
    productionSpeed: 1,
    dropSpeed: 1,
    eventMode: 'kepress'
  }
)

game.setCoins = [
  {
    name: '銅幣',
    image: './images/coin/coin_level1.png',
    speed: 200,
    width: 20,
    height: 20,
    scale: 5,
    action: function(){
      console.log('銅幣')
    }
  },
  {
    name: '銀幣',
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
    name: '金幣',
    file: './images/sprites/coin-rotate.json',
    length: 6,
    speed: 300,
    scale: 2,
    action: function(){
      console.log('金幣')
    }
  }
]

console.log(game)

window.addEventListener('load', function(){
  game.start()
})
