
cnvWidth = 640;
cnvHeight = 480;
var playr;
var foodies;

function setup() {
  createCanvas(cnvWidth, cnvHeight);
  playr = new snake(cnvWidth/2,cnvHeight/3);
  foodies = new Array(10);
  for( i=0; i<foodies.length;i++)
  {
    foodies[i] = new foodie();
  }
  frameRate(10);
}

function draw() {
  background(55);
  playr.update();
  playr.drawMe();
  foodies.forEach(function(entry) {
    entry.drawMe();
  }, this);
}

class snake {
  constructor (x, y){
   this.x = x;
   this.y = y;
   this.direction = "UP";
  }
  update(){
    switch(this.direction){
      case "UP":
        this.y=this.y-1;
        break;
    }
  }
  drawMe(){
    fill('white');
    rect(this.x,this.y,cnvWidth/64,cnvHeight/48);
  }
}

class foodie {
  constructor (){
    this.x = (random()*cnvWidth);
    this.y = (random()*cnvHeight);
  }
  drawMe(){
    fill('red');
    rect(this.x,this.y,cnvWidth/64,cnvHeight/48);
  }
}