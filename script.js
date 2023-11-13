// let frames = 30;


let isGamer = false; // Флаг, показывающий, запущена ли игра
let gameInterval; // Переменная для хранения идентификатора интервала

// Основное меню
const menu = document.getElementById('menu');
const startButton = document.getElementById('startButton');

// Обработчики событий для кнопок
startButton.addEventListener('click', startGame);

// Функция начала игры
function startGame() {
    isGamer = true;
    menu.style.display = 'none';
    playAudio();
    gameInterval = setInterval(draw, 10);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
size = [1480, 920];

livesCount = 3;


spaceshipWidth = 200/4;
spaceshipHeight = 80;
spaceshipX = size[0]/2-spaceshipWidth/2;
spaceshipY = size[1]-spaceshipHeight/0.5;
spaceshipSpeed = 2;

nulled = false; // переменная, отвечающая за то были ли удалены все объекты с поля


pressedButtons = {
  "a": false, "d": false, "space": false
} // нажатые кнопки



function playAudio() {
  var audio = new Audio('./main_theme.mp3');
  audio.volume = 0.5;
  audio.play();
}

////////////////////////////////////////////

const bacground_canvas = new Image();
bacground_canvas.src = "./img/bg_canvas.png"


function background() {
  //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(bacground_canvas,0 , 0, size[0], size[1]);
}
 

////////////////////////////////////////////
/// DOMContentLoaded означает, что внутренняя
/// функция будет исполнятся только после загрузки
/// всех компонентов на странице
  window.addEventListener('DOMContentLoaded', function () {
    canvas.width = size[0];
    canvas.height = size[1];

    ///тест добавления игрока в таблицу рекордов
const playerName = "Игрок 1";
const playerScore = 1000;
addScoreToLeaderboard(playerName, playerScore);


    setInterval(draw,10);//запускает покадровую отрисовку


    function draw(){
      if (livesCount > 0) {
        game()//логика игры 
        if(Enm.stop == true && Enm2.stop == true){
          Victory()
        }
          
      }
      else gameOver(); 
    }
    

  }, false);

////////////////////////////////////////////

  function game() {

    background();

      window.onkeydown = function(event)
      {
      if (String(event.key) == "a") {
        pressedButtons["a"] = true;
      }
      if (String(event.key) == "d") {
        pressedButtons["d"] = true;
      }
      if (String(event.key) == " ") {
        pressedButtons["space"] = true;
      }
    }
    window.onkeyup = function(e) {
      if (String(e.key) == "a") {
        pressedButtons["a"] = false;
      }
      if (String(e.key) == "d") {
        pressedButtons["d"] = false;
      }
      if (String(e.key) == " ") {
        pressedButtons["space"] = false;
      }
    }

    if (pressedButtons["a"]) ship.x -= ship.speed;
    if (pressedButtons["d"]) ship.x += ship.speed;
    if (pressedButtons["space"]) { 
      if (!ship.isShooting){ // если нажали пробел и стрельба еще не начиналась
      ship.isShooting = true;
      ship.Shoot();
    ship.interval = setInterval(function () { if (!ship.stop)ship.Shoot()}, 500); // циклическая стрельба
      }
    }
    else { // это если мы отпустили пробел и нужно прекратить стрельбу
      if (ship.isShooting){
        ship.isShooting = false;
        clearInterval(ship.interval); // прекращает цикл
        }
    }


    Enm.move();
    Enm2.move();
    CheckBoom(); // проверяет произошел ли взрыв, после чего убирает с поля
  }


  function CheckBoom() {
    if (boom.isDraw && boom.isLastFrame) boom.isDraw = false;
  }
//////////Game Over//////////////////////////////////////////////////////////////////////

all = []

  function gameOver() {

    if (!nulled){ // если объекты не были еще удалены, то удали их
    for(var i=0; i < all.length; i++){
      all[i].delete();
      GameOverHeart.stop = false;
    }
    nulled = true;
  }
    

    ctx.fillStyle = "Black";
    ctx.fillRect(0,0,size[0], size[1]);
    ctx.font = "75px GameOver"; //название шрифта берется с CSS
    ctx.fillStyle = "White";
    ctx.fillText("GAME OVER" , (size[0]-75*"GAMEOVER".length)/2, size[1]/2);

    GameOverHeart.isDraw = true; // огонек в конце игры
  }


  /////////////// Победа, при убийстве всех игроков/////////////////
  function Victory(){

    if (!nulled){ // если объекты не были еще удалены, то удали их
      for(var i=0; i < all.length; i++){
        all[i].delete();
        GameOverHeart.stop = false;
      }
      nulled = true;
    }
    
  
    ctx.fillStyle = "Black";
    ctx.fillRect(0,0,size[0], size[1]);
    ctx.font = "75px GameOver"; //название шрифта берется с CSS
    ctx.fillStyle = "White";
    ctx.fillText("YOU WIN" , (size[0]-75*"YOU WIN".length)/2+50, size[1]/2)-50;

    GameOverHeart.isDraw = true; 

    
  }

////////////////////Sprite///////////////////////////////////////////////////////



class Sprite {

    constructor(options) {
        this.ctx = options.ctx;
        this.image = new Image();
        this.image.src = options.imgSrc;
        this.frameIndex = 0;//текущий фрейм
        this.tickCount = 0; // счетчик тиков
        this.ticksPerFrame = options.ticksPerFrame || 0; // тиков в кадре
        this.numberOfFrames = options.numberOfFrames || 1; // кол-во кадров
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;


        // isDraw - отрисовывается ли объект
        if (options.isDraw == undefined) {
          this.isDraw = true;
        }
        else {
          this.isDraw = options.isDraw;
        }
        this.speed = options.speed;
        // this.all.push(this);

        this.isLastFrame = false; // отрисовался ли в данный момент последний кадр
        this.stop = false; // нужно ли остановить отрисовку спрайта (насовсем)
        all.push(this); // добавить в список спрайтов
        this.start(); // запуск спрайта


        
    }
/// update() обновляет значения спрайта, таких как текущий кадр
    update() {
        this.tickCount++;

        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++;
                if (this.frameIndex == this.numberOfFrames - 2){
                  this.isLastFrame = true;
                }
            } else {
                this.frameIndex = 0;
                this.isLastFrame = false;
            }
        }
    }
/// render() непосредственно отрисовывает спрайт на экране
    render() {
      if (this.isDraw) {
        this.ctx.drawImage(
            this.image,
            this.frameIndex * this.width / this.numberOfFrames,
            0,
            this.width / this.numberOfFrames,
            this.height,
            this.x,
            this.y,
            this.width / this.numberOfFrames,
            this.height
        )
    }
  }

  delete() {
    this.stop = true;
  }

/// Метод isCollision() проверяет столкнулся ли объект с какими-либо другими объектами
    isCollision(objects) {
      for(var i = 0; i < objects.length; i++) {
      if (objects[i] != this) {
      if (this.x < objects[i].x + objects[i].width/objects[i].numberOfFrames &&
        this.x + this.width/this.numberOfFrames > objects[i].x &&
        this.y < objects[i].y + objects[i].height &&
        this.y + this.height > objects[i].y) return true;
      }
      }
      return false;
    }
    start() {
        let loop = () => {
          if (!this.stop) {
            this.update(); // обновить значения
            this.render(); // отрисовать
/*            if (this instanceof Bullet) this.Shoot();*/
              window.requestAnimationFrame(loop); // запросить след. кадр
          }
        }

        window.requestAnimationFrame(loop); // стартовый запуск цикла выше
    }
}

////////class Bullet//////////////////////////////////////

class Bullet extends Sprite {
  constructor(options) {
    super({
      ctx: options.ctx,
      imgSrc: options.imgSrc,
      width: options.width,
      height: options.height,
      x: options.x,
      y: options.y,
      numberOfFrames: options.numberOfFrames,
      ticksPerFrame: options.ticksPerFrame,
      speed: options.speed,
      isDraw: options.isDraw
    })
      this.direction = options.direction; // направление движения пули
  }

  Shoot() {
    if (!this.isDraw) // если пуля не отрисовывается
    {
      this.isDraw = true;
  }
  else {
    this.y += this.speed * this.direction;
    if (livesCount > 0 && this.isCollision([ship])) {
      lives[livesCount-1].isDraw = false;
      livesCount--;

      boom.frameIndex = 0;
      boom.isDraw = true;
      boom.x = ship.x;
      boom.y = ship.y;
    }

    if ( this.isCollision([Enm])) {//пуля столкнулась с врагом
      Enm.x = -400;
      Enm.y = -400;
      boom.frameIndex = 0;
      boom.isDraw = true;
      boom.x = Enm.x;
      boom.y = Enm.y;

      Enm.stop = true;//убрать объект
    }

    if (this.isCollision([Enm2])) {//пуля столкнулась с врагом
      Enm2.x = -400;
      Enm2.y = -400;


      boom.frameIndex = 0;
      boom.isDraw = true;
      boom.x = Enm2.x;
      boom.y = Enm2.y;

      Enm2.stop = true;
    }
    if (this.isCollision([ship, Enm, Enm2]) ||
    this.y > size[1] || this.y < 0) {//если вышел за поле или врезался в кого-то
      this.delete();
      this.x = -400;
      this.y = -400;  
      delete this;
  }


}
}
}

////////class Enemy////////////////////////////////////

class Enemy extends Sprite {
  constructor(options) {
    super({
      ctx: options.ctx,
      imgSrc: options.imgSrc,
      width: options.width,
      height: options.height,
      x: options.x,
      y: options.y,
      numberOfFrames: options.numberOfFrames,
      ticksPerFrame: options.ticksPerFrame,
      speed: options.speed,
      isDraw: options.isDraw
    })
      this.direction = 1;
      setInterval(() => { // запуск стрельбы врага
        if (!this.stop) this.Shoot();
      }, 500);
  
  }



  move() {
    if (this.x + this.width > size[0] ||
      this.x < 0 ||
      this.isCollision(Enemies)) this.direction *= -1;
    this.x += 3*this.direction; // движение врага
  }

  Shoot() {
     let bullet = new Bullet({
      ctx: canvas.getContext('2d'),
      imgSrc: './img/shoot.png',
      width: 48,
      height: 16,
      x: this.x + this.width/2,
      y: this.y + this.width,
      numberOfFrames: 3,
      ticksPerFrame: 8,
      isDraw: true,
      speed: 2,
      direction: 1
    })
    setInterval(function() {
      bullet.Shoot();
    }, 10);



}



}




////////class Player///////////////////////////////////

class Player extends Sprite {
  constructor(options) {
    super({
      ctx: options.ctx,
      imgSrc: options.imgSrc,
      width: options.width,
      height: options.height,
      x: options.x,
      y: options.y,
      numberOfFrames: options.numberOfFrames,
      ticksPerFrame: options.ticksPerFrame,
      speed: options.speed,
      isDraw: options.isDraw
    })
    this.shoot = new Sprite({
      ctx: canvas.getContext('2d'),
      imgSrc: './img/shoot.png',
      width: 48,
      height: 16,
      x: this.x + this.width/this.numberOfFrames/2,
      y: this.y,
      numberOfFrames: 3,
      ticksPerFrame: 8,
      speed: 2,
      isDraw: true
    })
    this.shoot.isDraw = false;
    this.isShooting = false;
    this.interval = null;

    

  }
   Shoot() {
     let bullet = new Bullet({
      ctx: canvas.getContext('2d'),
      imgSrc: './img/shoot.png',
      width: 48,
      height: 16,
      x: this.x + this.width/2/4-11,
      y: this.y-15,
      numberOfFrames: 3,
      ticksPerFrame: 8,
      isDraw: true,
      speed: 2,
      direction: -1
    }
    )
    setInterval(function() { // запуск стрельбы
      bullet.Shoot();
    }, 10);

}
}


let ship = new Player({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/sprites.png',
  width: 300,
  height: 120,
  x: spaceshipX,
  y: spaceshipY,
  numberOfFrames: 4,
  ticksPerFrame: 8,
  speed: 4,
  isDraw: true
})




/////Сердечки////////////////////////////////////////
let lives = [new Sprite({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/heart.png',
  width: 974,
  height: 93,
  x: 10,
  y: 10,
  numberOfFrames: 10,
  ticksPerFrame: 6,
  speed: 4,
  isDraw: true
}), 
new Sprite({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/heart.png',
  width: 974,
  height: 93,
  x: 110,
  y: 10,
  numberOfFrames: 10,
  ticksPerFrame: 6,
  speed: 4,
  isDraw: true
}),
new Sprite({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/heart.png',
  width: 974,
  height: 93,
  x: 210,
  y: 10,
  numberOfFrames: 10,
  ticksPerFrame: 6,
  speed: 4,
  isDraw: true
})]


///////Test enemies///////////////////////////////
let Enm = new Enemy({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/enemy.png',
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  numberOfFrames: 1,
  ticksPerFrame: 6,
  isDraw: true
})

let Enm2 = new Enemy({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/enemy.png',
  width: 100,
  height: 100,
  x: 800,
  y: 100,
  numberOfFrames: 1, 
  ticksPerFrame: 6,
  isDraw: true
})

Enemies =[Enm, Enm2]


////////gameOver_heart_////////////////

let GameOverHeart = new Sprite({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/heart_gameover.png',
  width: 6158,
  height: 124,
  x: size[0]/2-6158/48,
  y: size[1]/2,
  numberOfFrames: 48, 
  ticksPerFrame: 3,
  isDraw: false
})

let boom = new Sprite({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/boom.png',
  width: 800,
  height: 61,
  x: 300,
  y: 300,
  numberOfFrames: 13, 
  ticksPerFrame: 3,
  isDraw: false
})




////////////////////////Добавление рещультатов в таблицу/////////////////////////////////////
const leaderboardTable = document.getElementById('leaderboard');
function addScoreToLeaderboard(playerName, score) {
  const leaderboardTable = document.getElementById('leaderboard');
  const leaderboardBody = leaderboardTable.getElementsByTagName('tbody')[0];

  const newRow = leaderboardBody.insertRow();
  const nameCell = newRow.insertCell(0);
  const scoreCell = newRow.insertCell(1);

  nameCell.textContent = playerName;
  scoreCell.textContent = score;
}
