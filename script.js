// let frames = 30;


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
size = [1480, 920]

livesCount = 3;


spaceshipWidth = 200/4;
spaceshipHeight = 80;
spaceshipX = size[0]/2-spaceshipWidth/2;
spaceshipY = size[1]-spaceshipHeight/0.5;
spaceshipSpeed = 2;




pressedButtons = {
  "a": false, "d": false, "space": false
}


////////////////////////////////////////////

const bacground_canvas = new Image();
bacground_canvas.src = "./img/bg_canvas.png"


function background() {
  //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(bacground_canvas,0 , 0, size[0], size[1]);
}
 

////////////////////////////////////////////
/// DOMContentLoaded означает, что внутренняя функция будет исполнятся только после загрузки всех компонентов на странице
  window.addEventListener('DOMContentLoaded', function () {
    canvas.width = size[0];
    canvas.height = size[1];

    ///тест добавления игрока в таблицу рекордов
const playerName = "Игрок 1";
const playerScore = 1000;
addScoreToLeaderboard(playerName, playerScore);



    setInterval(draw,10)



    function draw(){
      if (livesCount > 0) {
        game()
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
    // if (pressedButtons["space"]) ship.Shoot();

    Enm.move();
    Enm.Shoot();
    Enm2.move();
    Enm2.Shoot();



  }

//////////Game Over//////////////////////////////////////////////////////////////////////

  function gameOver() {
    
    ship.isDraw = false;
    Enm.isDraw = false;
    Enm2.isDraw = false;
    Enm.disable_shoot();
    Enm2.disable_shoot();

    
    ctx.fillStyle = "Black";
    ctx.fillRect(0,0,size[0], size[1]);
    ctx.font = "75px GameOver";
    ctx.fillStyle = "White";
    ctx.fillText("GAME OVER" , (size[0]-75*"GAMEOVER".length)/2, size[1]/2);

    GameOverHeart.isDraw = true;




  }


////////////////////Sprite///////////////////////////////////////////////////////


class Sprite {
  // all = [];
    constructor(options) {
        this.ctx = options.ctx;
        this.image = new Image();
        this.image.src = options.imgSrc;
        this.frameIndex = 0;
        this.tickCount = 0;
        this.ticksPerFrame = options.ticksPerFrame || 0;
        this.numberOfFrames = options.numberOfFrames || 1;
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;

        if (options.isDraw == undefined) {
          this.isDraw = true;
        }
        else {
          this.isDraw = options.isDraw;
        }
        this.speed = options.speed;
        // this.all.push(this);
        this.start();
    }
/// update() обновляет значения спрайта, таких как текущий кадр
    update() {
        this.tickCount++;

        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.numberOfFrames - 1) {
                this.frameIndex++;
            } else {
                this.frameIndex = 0;
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
            this.update();
            this.render();

            window.requestAnimationFrame(loop);
        }
        
        window.requestAnimationFrame(loop);
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
  })
  this.direction = 1;
  this.shoot = new Sprite({
    ctx: canvas.getContext('2d'),
    imgSrc: './img/shoot.png',
    width: 48,
    height: 16,
    x: this.x + this.width/2,
    y: this.y + this.width,
    numberOfFrames: 3,
    ticksPerFrame: 8,
    isDraw: true,
    speed: 2
  })
  
  }



  move() {
    if (this.x + this.width > size[0] || this.x < 0 || this.isCollision(Enemies)) this.direction *= -1;
    this.x += 3*this.direction;
  }

  Shoot() {

    if (!this.shoot.isDraw) // если пуля не отрисовывается
    {
      this.shoot.x = this.x + this.width/2;
      this.shoot.y = this.y + this.width;
      this.shoot.isDraw = true;
  }
  else {
    this.shoot.y += this.shoot.speed;
    if (livesCount > 0 && this.shoot.isCollision([ship])) {
      lives[livesCount-1].isDraw = false;
      livesCount--;
    }
    if (this.shoot.isCollision([ship]) ||
    this.shoot.y > size[1]) {
      this.shoot.x = this.x + this.width/2;
      this.shoot.y = this.y + this.width;
     
  }


}


  }
  disable_shoot() {
    this.shoot.isDraw = false;
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

    

  }
//   Shoot() {

//     if (!this.shoot.isDraw) // если пуля не отрисовывается
//     {
//       this.shoot.x = this.x + this.width/this.numberOfFrames/2;
//       this.shoot.y = this.y;
//       isDraw = true;
//   }
//   else {
//   this.shoot.y -= this.shoot.speed;
//   if (this.shoot.isCollision(Enemies) ||
//   this.shoot.y < 0) {
//     this.shoot.isDraw = false;
//   }
//   }
// }
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
  width: 3631,
  height: 100,
  x: size[0]/2,
  y: size[1]/2,
  numberOfFrames: 30, 
  ticksPerFrame: 6,
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


