let frames = 30;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
size = [1480, 920]



spaceshipWidth = 200/4;
spaceshipHeight = 80;
spaceshipX = size[0]/2-spaceshipWidth/2;
spaceshipY = size[1]-spaceshipHeight/0.5;
spaceshipSpeed = 2;


var sprite = new Image();
sprite.src = './img/boom.png'

////////////////////////////////////////////


// spaceship.onload = function () {
//   ctx.drawImage(spaceship, spaceshipX, spaceshipY, spaceshipWidth,spaceshipWidth)
// }


////////////////////////////////////////////


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

  window.addEventListener('DOMContentLoaded', function () {
    canvas.width = size[0];
    canvas.height = size[1];

    
    setInterval(draw,10)


    function draw(){

    game()
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


////////////////////Sprite///////////////////////////////////////////////////////


class Sprite {
  
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


        this.isDraw = options.isDraw || true;
        this.speed = options.speed;
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
    isDraw: false,
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
      isDraw = true;
  }
  else {
    this.shoot.y += this.shoot.speed;
    if (this.shoot.isCollision([ship]) ||
    this.shoot.y > size[1]) {
      this.shoot.x = this.x + this.width/2;
      this.shoot.y = this.y + this.width;
  }
}

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
      speed: options.speed
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
      speed: 2
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
  speed: 4
})



///////Test enemies///////////////////////////////
let Enm = new Enemy({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/enemy.png',
  width: 100,
  height: 100,
  x: 100,
  y: 100,
  numberOfFrames: 1, 
})

let Enm2 = new Enemy({
  ctx: canvas.getContext('2d'),
  imgSrc: './img/enemy.png',
  width: 100,
  height: 100,
  x: 800,
  y: 100,
  numberOfFrames: 1, 
})

Enemies =[Enm, Enm2]