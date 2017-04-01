
var gm;
var playr;
var foodies;

//var gameState = {GO : 1, NO : 2};

function setup() {
  gm = new game(96,48,window.innerWidth,window.innerHeight);
  createCanvas(gm.cnvWidth, gm.cnvHeight);
  playr = new snake(1,1);
  foodies = new Array(10);
  for( i=0; i<foodies.length;i++)
  {
    foodies[i] = new foodie();
  }
  foodieGiblets = [];
  frameRate(20);
}

function keyPressed()
{

  if(gm.status == "GO"){
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
  }


  if(gm.status == "PAUSED")
  {
    if(keyIsDown(UP_ARROW)){
      gm.pauseMenuSelection.push(gm.pauseMenuSelection.shift());
    }
    if(keyIsDown(DOWN_ARROW)){
      gm.pauseMenuSelection.unshift(gm.pauseMenuSelection.pop());
    }
    if(keyIsDown(32)){
      for(i=0;i<gm.pauseMenuSelection.length;i++){
        if(gm.pauseMenuSelection[i])
          gm.pauseMenuFunctions[i]();
      }
    }
  }
  else if(gm.status == "SETTINGS")
  {
    
  }
  else if(keyCode == 32){
    if(gm.status == "GO")
      gm.status = "PAUSED";
    else if(gm.status == "PAUSED")
      gm.status = "GO";
    else if(gm.status == "LOST")
      gm.reset();
  }
}

function draw() {
  if(gm.status == "GO")
  {
    gm.updateBackground();
    background(gm.background);
    playr.update();
    foodies.forEach(function(entry) {
      entry.update();
      entry.draw();
    }, this);
    playr.draw();
    foodieGiblets.forEach(function(item, index, object){
      item.update();
      item.draw();
      if(item.deleteMe)
        foodieGiblets.splice(index,1);
    }, this);
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
    this.background = [120,120,120];
    this.backgroundChangeRate = [20,20,20];
    this.pauseMenuSelection = [1,0,0];
    this.pauseMenuFunctions = [
      function() { gm.status = "GO";},
      function() { gm.status = "SETTINGS";},
      function() { window.close();}
    ];
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
    if(this.status == "PAUSED")
    {
      this.drawPauseMenu();
    }
  }
  updateBackground(){
    for(i=0;i<3;i++){
      this.updateSingleBackgroundValue(i);
    }
  }
  updateSingleBackgroundValue(i){
    var bkg = this.background;
    var bkgChgRt = this.backgroundChangeRate;
    bkg[i] = bkg[i] + floor(random()*bkgChgRt[i])-bkgChgRt[i]/2;
  }
  //Used in Draw
  drawScore(){
    textSize(gm.cnvWidth/50);
    textAlign(LEFT);
    fill(0,102,153);
    text("SCORE: " + (playr.length - 1),0,0,gm.cnvWidth,100);
  }
  drawGameOver(){
      textAlign(LEFT);
      textSize(gm.cnvWidth/15)
      text("GAME OVER", gm.cnvWidth/3.5, gm.cnvHeight/2)
  }
  drawPauseMenu(){
    fill(20);
    rect(gm.cnvWidth/4,gm.cnvHeight/5,gm.cnvWidth/2,gm.cnvHeight/2)
    fill(0,102,153);
    textAlign(CENTER);
    textSize(gm.cnvWidth/15);
    text("PAUSED", gm.cnvWidth/2,gm.cnvHeight/3);
    this.drawMenuItem("Resume Snekking",1);
    this.drawMenuItem("Snek Settings",2)
    this.drawMenuItem("Quit Snekking",3);

  }
  drawMenuItem(textual,menuPosition){
    textSize(gm.cnvWidth/30);
    if(gm.pauseMenuSelection[menuPosition-1])
      fill(120,120,30);
    else
      fill(0,102,153);
    text(textual, gm.cnvWidth/2, gm.cnvHeight/3 + menuPosition*gm.cnvHeight/12);
  }
  reset(){
    setup();
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
   this.bodyColors = ['yellow','red','red','yellow','black','black'];
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
    this.drawHead('black');
    for(i=1;i<this.tail.length;i++)
    {
      var colorSlot = (i+this.bodyColors.length-1)%this.bodyColors.length;
      if(i+1==this.tail.length){
        this.drawTail(this.tail[i][0],this.tail[i][1],'black',this.tail[i-1]);
      }
      else
        this.drawBody(this.tail[i][0],this.tail[i][1],this.bodyColors[colorSlot]);
    }
  }
  drawHead(color){
    fill(color);
    var scaledx = this.x*gm.xscale;
    var scaledy = this.y*gm.yscale;
    if(this.direction == "RIGHT") {
      quad(scaledx,scaledy,scaledx,scaledy+gm.yscale,scaledx+gm.xscale,
        scaledy+2*gm.yscale/3,scaledx+gm.xscale,scaledy+gm.yscale/3); }
    else if(this.direction == "LEFT") {
      quad(scaledx+gm.xscale,scaledy,scaledx+gm.xscale,scaledy+gm.yscale,
        scaledx,scaledy+2*gm.yscale/3,scaledx,scaledy+gm.yscale/3); }
    else if(this.direction == "DOWN") {
      quad(scaledx,scaledy,scaledx+gm.xscale,scaledy,
        scaledx+2*gm.xscale/3,scaledy+gm.yscale,scaledx+gm.xscale/3,scaledy+gm.yscale); }
    else if(this.direction == "UP") {
      quad(scaledx,scaledy+gm.yscale,scaledx+gm.xscale,scaledy+gm.yscale,
        scaledx+2*gm.xscale/3,scaledy, scaledx+gm.xscale/3,scaledy); }
  }
  drawTail(x,y,color,prevSegment){
    var tailDirection = this.getTailDirection(x,y,prevSegment);
    fill(color);
    var scaledx = x*gm.xscale;
    var scaledy = y*gm.yscale;
    if(tailDirection == "LEFT")
      triangle(scaledx,scaledy,scaledx,scaledy+gm.yscale,scaledx+gm.xscale,scaledy+gm.yscale/2); 
    else if(tailDirection == "RIGHT")
      triangle(scaledx+gm.xscale,scaledy,scaledx+gm.xscale,scaledy+gm.yscale,scaledx,scaledy+gm.yscale/2);
    else if(tailDirection == "UP")
      triangle(scaledx,scaledy,scaledx+gm.xscale,scaledy,scaledx+gm.xscale/2,scaledy+gm.yscale);
    else if(tailDirection == "DOWN")
      triangle(scaledx,scaledy+gm.yscale,scaledx+gm.xscale,scaledy+gm.yscale,scaledx+gm.xscale/2,scaledy);   
  }
  getTailDirection(x,y,prevSegment){
    if(x > prevSegment[0])
      return "LEFT";
    else if(x < prevSegment[0])
      return "RIGHT";
    else if(y < prevSegment[1])
      return "DOWN";
    else
      return "UP";
  }
  drawBody(x,y,color)
  {
    fill(color);
    rect(x*gm.xscale,y*gm.yscale,gm.xscale,gm.yscale);
  }
}

class foodie {
  constructor (){
    this.x = (floor(random()*gm.gridWidth));
    this.y = (floor(random()*gm.gridHeight));
    this.color = [random()*255,random()*255,random()*255];
    this.gibletQtyRange = [10,15];
    this.iteration = 0;
  }
  draw(){ 
    fill(this.color);
    rect(this.x*gm.xscale,this.y*gm.yscale,gm.xscale,gm.yscale);
  }
  update(){
    if(this.x == playr.x && this.y == playr.y){
      this.getEaten();
    }
  }
  getEaten(){
    var numberOfGiblets = floor(random()*(this.gibletQtyRange[1]-this.gibletQtyRange[0]) +this.gibletQtyRange[0]);//10-15;
    for(i=0;i<numberOfGiblets;i++)
    {
      foodieGiblets.push(new foodieGiblet(this.x,this.y,this.color));
    }
    this.x = (floor(random()*gm.gridWidth));
    this.y = (floor(random()*gm.gridHeight));
    gm.background = [random()*255,random()*255,random()*255];
    this.changeColor();
    playr.length++;
  }
  changeColor(){
    this.color = [random()*255,random()*255,random()*255];
  }
}

class foodieGiblet {
  constructor (x,y,color){
    this.direction = random()*2*Math.PI;
    this.x = x*gm.xscale;
    this.y = y*gm.yscale;
    this.color = color;
    this.deleteMe = false;
    this.speed = (gm.cnvWidth / 50)*(random()/2 +.5);
    this.size = (gm.xscale+gm.yscale)/((2)*(1+random()));
    this.rotateSpeed = (1+random()*8)*Math.PI/6;
    this.angle = random()*2*Math.PI;
    this.iteration = 0;
  }  
  update() {
    this.x = this.x + Math.cos(this.direction)*this.speed;
    this.y = this.y + Math.sin(this.direction)*this.speed;
    this.angle = this.angle += this.rotateSpeed;
    this.iteration = this.iteration + this.speed*10;
    this.deleteMe = this.isOffScreen();      
  }
  isOffScreen(){
    if(this.x < 0 || this.y < 0 || this.x > gm.cnvWidth || this.y > gm.cnvHeight){
      return true;
    }
    else
      return false;
  }
  draw(){
    fill(this.color);
    rectMode(CENTER);
    push();
    translate(this.x,this.y);
    rotate(this.angle);
    rect(0,0,this.size,this.size);
    //this.drawSillyCircle();
    pop();
    rectMode(CORNER);
  }
  drawSillyCircle(){
    noFill();
    stroke(this.color);
    strokeWeight(2);
    ellipse(0,0,this.iteration,this.iteration);
  }
}

