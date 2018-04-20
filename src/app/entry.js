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
    name: '1',
    file: './images/sprites/coin-rotate.json',
    length: 6,
    speed: 1,
    probability: [10, 10],
    action: function(){
      alert(123)
    }
  },
  // {
  //   name: '2',
  //   file: './images/sprites/coin-rotate2.json',
  //   length: 6,
  //   speed: 1,
  //   probability: [1, 10],
  //   action: function(){
  //     alert(123)
  //   }
  // },
  // {
  //   name: '3',
  //   // file: './images/sprites/coin-rotate2.json',
  //   length: 6,
  //   speed: 1,
  //   probability: [1, 10],
  //   action: function(){
  //     alert(123)
  //   }
  // }
]

console.log(game)

window.addEventListener('load', function(){
  game.start()
})
