
var gm;
var playr;
var foodies;

function setup() {
  gm = new game(64,48,1000,750);
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
    if(playr.direction != "RIGHT")
      playr.direction = "LEFT";
  if(keyIsDown(RIGHT_ARROW))
    if(playr.direction != "LEFT")
      playr.direction = "RIGHT";
  if(keyIsDown(UP_ARROW))
    if(playr.direction != "DOWN")
      playr.direction = "UP";
  if(keyIsDown(DOWN_ARROW))
    if(playr.direction != "UP")
      playr.direction = "DOWN";
  if(gm.status == "GO")
  {
    background(55);
    playr.update();
    foodies.forEach(function(entry) {
      entry.update();
      entry.draw();
    }, this);
    playr.draw();
  }
  gm.draw();

}

class game {
  constructor(gridWidth,gridHeight,cnvWidth,cnvHeight){
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cnvWidth = cnvWidth;
    this.cnvHeight = cnvHeight;
    this.status = "GO";
  }
  get xscale() {
    return this.cnvWidth/this.gridWidth;
  }
  get yscale() {
    return this.cnvHeight/this.gridHeight;
  }
  draw(){  
    this.drawScore();
    if(this.status == "LOST")
    {
      this.drawGameOver();
    }
  }

  //Used in Draw
  drawScore(){
    textSize(gm.cnvWidth/50);
    fill(0,102,153);
    text("SCORE: " + (playr.length - 1),0,15);
  }
  drawGameOver(){
      textSize(gm.cnvWidth/15)
      text("GAME OVER", gm.cnvWidth/3.5, gm.cnvHeight/2)
  }
}

class snake {
  constructor (x, y){
   this.x = x;
   this.y = y;
   this.direction = "DOWN";
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
    for(i=this.length-1;i>0;i--)
    {
        this.tail[i] = this.tail[i-1];
    }
    this.tail[0] = new Array(this.x,this.y);
    if(this.x < 0 || this.y < 0 || this.x > gm.gridWidth-1 || this.y > gm.gridHeight-1)
      gm.status = "LOST";
    for(i=1;i<this.tail.length;i++)
    {
      if(this.tail[0][0]==this.tail[i][0] && this.tail[0][1] == this.tail[i][1])
        gm.status = "LOST";
    }
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
      this.x = (floor(random()*gm.gridWidth));
      this.y = (floor(random()*gm.gridHeight));
      playr.length++;
    }
  }

}