let frames = 30;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
size = [1280, 800]

const spaceship = new Image();
spaceship.src = "./img/spaceship.png"


spaceshipWidth = 150;
spaceshipX = size[0]/2-spaceshipWidth/2;
spaceshipY = size[1]-spaceshipWidth-50;
spaceshipSpeed = 2;


var sprite = new Image();
sprite.src = './img/boom.png'

////////////////////////////////////////////


spaceship.onload = function () {
  ctx.drawImage(spaceship, spaceshipX, spaceshipY, spaceshipWidth,spaceshipWidth)
}


////////////////////////////////////////////


pressedButtons = {
  "a": false, "d": false
}


////////////////////////////////////////////

const bacground_canvas = new Image();
bacground_canvas.src = "./img/bg_canvas.png"


function background() {
  //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(bacground_canvas,0 , 0, 1280, 800);
}
 

////////////////////////////////////////////

  window.addEventListener('DOMContentLoaded', function () {
    canvas.width = size[0];
    canvas.height = size[1];
    setInterval(draw,10)


    function draw(){
    background();
    game()
    }
    

  }, false);

////////////////////////////////////////////

  function game() {
    spaceship.onload(0, 0);

      window.onkeydown = function(event)
      {
      if (String(event.key) == "a") {
        pressedButtons["a"] = true;
      }
      if (String(event.key) == "d") {
        pressedButtons["d"] = true;
      }
    }
    window.onkeyup = function(e) {
      if (String(e.key) == "a") {
        pressedButtons["a"] = false;
      }
      if (String(e.key) == "d") {
        pressedButtons["d"] = false;
      }
    }

    if (pressedButtons["a"]) spaceshipX -= spaceshipSpeed;
    if (pressedButtons["d"]) spaceshipX += spaceshipSpeed;
  }

  ////////////////////////////////////////////


sprite.onload = function(){
  tick();
  requestAnimationFrame(tick);
};

var x = 0, tick_count = 0;

function tick(){
  if (tick_count > 10){
    draw_boom();
    tick_count = 1;
  }

  tick_count = 0;
  requestAnimationFrame(tick);
}

function draw_boom(){

  //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  ctx.clearRect(0,0, canvas.width, canvas.height)
  x = (x === 512 ? 0 : x + 50);
  ctx.drawImage(sprite_boom, 1000, 1000);
}