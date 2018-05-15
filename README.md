# Canvas 接金幣 套件說明

## 使用說明

```
```

## API

Class: CanvasCatchCoin

底層物件

```{.javascript}
{
  option // 遊戲整體設定
  coins // 金幣
  basket // 接取金幣物件
  countBoard // 計分板物件
  timer // 計時器
  controller // 遊戲控制器
  closeButton // 關閉遊戲按鈕
  backgroundImages // 背景圖層
}
```

***

### option

整體遊戲設定

> Object

| 屬性名稱 | 必填 | 預設值 | 允許值 | 說明 |
| ---- | ---- | ---- | ---- | ---- |
| width | V | null | Number | 遊戲畫布整體的寬 |
| height | V | null | Number | 遊戲畫布整體的高 |
| productionSpeed | X | null | Number | 金幣掉落的間隔時間（秒）|
| maxCoin | X | 10 | Number | 每一批金幣的最大數量 |
| minCoin | X | 3 | Number | 每一批金幣的最小數量）|

### coins

金幣物件

> Array > Object

| 屬性名稱 | 必填 | 預設值 | 允許值 | 說明 |
| ---- | ---- | ---- | ---- | ---- |
| score | V | null | Number | 金幣代表的分數 |
| speed | V | null | Number | 金幣下落速度（每秒移動的 px 數）|
| scale | V | null | Number | 金幣下落機率 (coins 的 scale / 總 scale) * 100% |
| action | X | null | function | 金幣碰到籃子時，會執行的事件
| image | 與 file 擇一必填 | null | String | 圖片路徑 '*.png , *.jpeg' |
| width | X | null | Number | 使用 image 屬性時， image 的 width 設定 |
| height | X | null | Number | 使用 image 屬性時， image 的 height 設定 |
| file | 與 image 擇一必填 | null | String | sprite json 檔案路徑 '*.json' |
| length | 視 file 屬性為必填 | null | Number | sprite 圖片張數 |

acion 屬性說明：

```{.javascript}
action: function(result){
  // Do SomeThing ...
}
```

參數

```
result: Object {
  score, // 金幣分數 type:Number
  stopGame // 停止遊戲 type:function
}
```

***

### backet

接金幣的 籃子 物件

> Object

| 屬性名稱 | 必填 | 預設值 | 允許值 | 說明 |
| ---- | ---- | ---- | ---- | ---- |
| speed | V | null | Number | 籃子左右移動的速度 （事件移動的 px 數）|
| image | 與 file 擇一必填 | null | String | 圖片路徑 '*.png , *.jpeg' |
| width | X | null | Number | 使用 image 屬性時， image 的 width 設定 |
| height | X | null | Number | 使用 image 屬性時， image 的 height 設定 |
| file | 與 image 擇一必填 | null | String | sprite json 檔案路徑 '*.json' |
| length | 視 file 屬性為必填 | null | Number | sprite 圖片張數 |

***

### countBoard

遊戲計分板

> Object

| 屬性名稱 | 必填 | 預設值 | 允許值 | 說明 |
| ---- | ---- | ---- | ---- | ---- |
| fontText | V | null | String | 記分板文字 |
| fontStyle | X | null | Object | [pixi 文字樣式屬性](http://pixijs.download/dev/docs/PIXI.TextStyle.html) |
| x | X | null | Number | X 軸座標位置 |
| y | X | null | Number | y 軸座標位置 |

***

### timer

遊戲計時器

> Object

| 屬性名稱 | 必填 | 預設值 | 允許值 | 說明 |
| ---- | ---- | ---- | ---- | ---- |
| sec | V | null | Number | 遊戲執行時間|
| fontText | V | null | String | 計時器文字 |
| fontStyle | X | null | Object | [pixi 文字樣式屬性](http://pixijs.download/dev/docs/PIXI.TextStyle.html) |
| x | X | null | Number | X 軸座標位置 |
| y | X | null | Number | y 軸座標位置 |

***

### controller

遊戲操作鍵盤

> Object

| 屬性名稱 | 必填 | 預設值 | 允許值 | 說明 |
| ---- | ---- | ---- | ---- | ---- |
| leftImage | V | null | String |左邊按鈕圖檔 (*.png)|
| rightImage | V | null | String |又邊按鈕圖檔 (*.png)|
| width | X | null | Number | image 的 width 設定 |
| height | X | null | Number | image 的 height 設定 |
| spacing | X | 0 | Number | 兩邊按鈕的間距|
| x | X | null | Number | X 軸座標位置 |
| y | X | null | Number | y 軸座標位置 |

***

### closeButton

關閉遊戲按鈕

> Object

| 屬性名稱 | 必填 | 預設值 | 允許值 | 說明 |
| ---- | ---- | ---- | ---- | ---- |
| image | V | null | String | 圖片路徑 '*.png , *.jpeg' |
| width | X | null | Number | 使用 image 屬性時， image 的 width 設定 |
| height | X | null | Number | 使用 image 屬性時， image 的 height 設定 |
| x | X | null | Number | X 軸座標位置 |
| y | X | null | Number | y 軸座標位置 |

***

### backgroundImages

畫布的背景圖片元素

> Array > Object

| 屬性名稱 | 必填 | 預設值 | 允許值 | 說明 |
| ---- | ---- | ---- | ---- | ---- |
| image | 與 file 擇一必填 | null | String | 圖片路徑 '*.png , *.jpeg' |
| width | X | null | Number | 使用 image 屬性時， image 的 width 設定 |
| height | X | null | Number | 使用 image 屬性時， image 的 height 設定 |
| file | 與 image 擇一必填 | null | String | sprite json 檔案路徑 '*.json' |
| length | 視 file 屬性為必填 | null | Number | sprite 圖片張數 |
| x | X | null | Number | X 軸座標位置 |
| y | X | null | Number | y 軸座標位置 |

***

### gameOver

遊戲結束是可執行的 hook

> function

```{.javascript}
gameOver = functoin(result){
    // Do SomeThing ...
}
```

參數

```{.javascript}
result: {
  score // 遊戲分數
}
```

***

### start

執行遊戲

***

## 範例：

```{.javascript}
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
```
