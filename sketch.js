
cnvWidth = 640;
cnvHeight = 480;
var gm;
var playr;
var foodies;

function setup() {
  gm = new game(64,48,640,480);
  createCanvas(gm.cnvWidth, gm.cnvHeight);
  playr = new snake(5,5);
  foodies = new Array(10);
  for( i=0; i<foodies.length;i++)
  {
    foodies[i] = new foodie();
  }
  frameRate(20);
}

function draw() {
  //CONTROL
  if(keyIsDown(LEFT_ARROW))
    playr.direction = "LEFT";
  if(keyIsDown(RIGHT_ARROW))
    playr.direction = "RIGHT";
  if(keyIsDown(UP_ARROW))
    playr.direction = "UP";
  if(keyIsDown(DOWN_ARROW))
    playr.direction = "DOWN";

  background(55);


  playr.update();
  foodies.forEach(function(entry) {
    entry.update();
    entry.draw();
  }, this);
  playr.draw();
}

class game {
  constructor(gridWidth,gridHeight,cnvWidth,cnvHeight){
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cnvWidth = cnvWidth;
    this.cnvHeight = cnvHeight;
  }
  get xscale() {
    return this.cnvWidth/this.gridWidth;
  }
  get yscale() {
    return this.cnvHeight/this.gridHeight;
  }
}

class snake {
  constructor (x, y){
   this.x = x;
   this.y = y;
   this.direction = "UP";
   this.speed = 1;
   this.length = 1;
   this.tail = new Array (new Array(x,y));
  }
  update(){
    switch(this.direction){
      case "UP":
        this.y=this.y-this.speed;
        break;
      case "DOWN":
        this.y=this.y+this.speed;
        break;
      case "LEFT":
        this.x=this.x-this.speed;
        break;
      case "RIGHT":
        this.x=this.x+this.speed;
        break;
    }
    console.log("Snake location:" + this.length + " " + this.x + ", " + this.y + "   " + this.tail[0] + " " + this.tail[1] + " " + this.tail[2] + " " + this.tail[3]);
    for(i=this.length-1;i>0;i--)
    {
        this.tail[i] = this.tail[i-1];
    }
    this.tail[0] = new Array(this.x,this.y);
  }
  draw(){
    fill('white');
    for(i=0;i<this.tail.length;i++)
    {
      rect(this.tail[i][0]*gm.xscale,this.tail[i][1]*gm.yscale,gm.xscale,gm.yscale);
    }
  }
}

class foodie {
  constructor (){
    this.x = (floor(random()*gm.gridWidth));
    this.y = (floor(random()*gm.gridHeight));
  }
  draw(){
    fill('red');
    rect(this.x*gm.xscale,this.y*gm.yscale,gm.xscale,gm.yscale);
  }
  update(){
    if(this.x == playr.x && this.y == playr.y){
      console.log("nom!");
      this.x = (floor(random()*gm.gridWidth));
      this.y = (floor(random()*gm.gridHeight));
      playr.length++;
    }
  }

}