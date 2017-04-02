
var gm;
var playr;
var foodies;
var pauseMenu;
var settingsMenu;

function setup() {
  gm = new game(96,48,window.innerWidth,window.innerHeight);
  createCanvas(gm.cnvWidth, gm.cnvHeight);
  frameRate(20);

  playr = new snake(1,1);
  foodies = new Array(10);
  for( i=0; i<foodies.length;i++)
  {
    foodies[i] = new foodie();
  }
  foodieGiblets = [];

  setupMenus();
}
function setupMenus() {
  setupPauseMenu();
  setupSettingsMenu();
}
function setupPauseMenu() {
  pauseMenu = new menu("PAUSED");
  pauseMenu.addMenuItem("Resume Snekking",new Function('gm.status = "GO"'));
  pauseMenu.addMenuItem("Snek Settings",new Function('gm.status = "SETTINGS";'));
  pauseMenu.addMenuItem("Quit Snekking",new Function('window.close();')); 
}
function setupSettingsMenu(){
  settingsMenu = new menu("SETTINGS");
  settingsMenu.addMenuItem("Back 2 Snek Pause", new Function('gm.status = "PAUSED"'));
}

function keyPressed()
{
  if(gm.status == "GO"){
    playr.keyPress(keyCode);
  }
  else if(gm.status == "PAUSED")
  {
    pauseMenu.keyPress(keyCode);
  }
  else if(gm.status == "SETTINGS")
  {
    settingsMenu.keyPress(keyCode);
  }
  else if(gm.status == "LOST")
    gm.reset();
}

function draw() {
  if(gm.status == "GO")
  {
    gm.updateBackground();
    playr.update();
    updateAndDrawFoodies();
    playr.draw();
    updateAndDrawGiblets();
  }
  gm.draw();
}
function updateAndDrawGiblets()
{
  for(i=0;i<foodieGiblets.length;i++){
    foodieGiblets[i].update();
    foodieGiblets[i].draw();
    if(foodieGiblets[i].deleteMe)
      foodieGiblets.splice(i,1);
}
function updateAndDrawFoodies(){
  foodies.forEach(function(entry) {
    entry.update();
    entry.draw();
  }, this);
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
    if(this.status == "PAUSED"){
      pauseMenu.draw();
    }
    if(this.status == "SETTINGS"){
      settingsMenu.draw();
    }
  }
  updateBackground(){
    for(i=0;i<3;i++){
      this.updateSingleBackgroundValue(i);
    }
    background(gm.background);
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
  reset(){
    setup();
  }
}

class menu {
  constructor (title){
    this.title = title;
    this.menuItems = new Array();
    this.selectedItem = 0;
  }
  addMenuItem(textual,funct)
  {
    this.menuItems[this.menuItems.length] = new menuItem(textual, funct);
  }
  menuMove(direction)
  {
    if(direction == "DOWN"){
      this.selectedItem++;
      if(this.selectedItem > this.menuItems.length - 1) {
        this.selectedItem = 0;
      }
    }
    else
      this.selectedItem--;
      if(this.selectedItem < 0){
        this.selectedItem = this.menuItems.length - 1;
      }
  }
  draw(){
    this.drawBackground();
    this.drawTitle();
    this.drawMenuItems();
  }
  drawBackground(){
    fill(20);
    rect(gm.cnvWidth/4,gm.cnvHeight/5,gm.cnvWidth/2,gm.cnvHeight/2)
  }
  drawTitle(){
    fill(0,102,153);
    textAlign(CENTER);
    textSize(gm.cnvWidth/15);
    text(this.title, gm.cnvWidth/2,gm.cnvHeight/3);
  }
  drawMenuItems(){
    for(i=0;i<this.menuItems.length;i++)
    {
      this.menuItems[i].draw(i, this.selectedItem);
    }
  }
  select(){
    this.menuItems[this.selectedItem].funct();
  }
  keyPress(key){
    if(key == UP_ARROW){
      this.menuMove("UP");
    }
    if(key == DOWN_ARROW){
      this.menuMove("DOWN");
    }
    if(key == 32){
      this.select();
    }
  }
}
class menuItem {
  constructor(textual,funct)
  {
    this.textual = textual;
    this.funct = funct;
  }
  draw(slot,selectedItem){
    textSize(gm.cnvWidth/30);
    if(slot == selectedItem)
      fill(120,120,30);
    else
      fill(0,102,153);
    text(this.textual, gm.cnvWidth/2, gm.cnvHeight/3 + (slot+1)*gm.cnvHeight/12);
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
  keyPress(key){
    if(key == LEFT_ARROW)
      if(playr.direction != "RIGHT")
        playr.direction = "LEFT";
    if(key == RIGHT_ARROW)
      if(playr.direction != "LEFT")
        playr.direction = "RIGHT";
    if(key == UP_ARROW)
      if(playr.direction != "DOWN")
        playr.direction = "UP";
    if(key == DOWN_ARROW)
      if(playr.direction != "UP")
        playr.direction = "DOWN";
    if(key == 32)
      gm.status = "PAUSED";
  }
}

class foodie {
  constructor (){
    this.x = (floor(random()*gm.gridWidth));
    this.y = (floor(random()*gm.gridHeight));
    this.color = [random()*255,random()*255,random()*255];
    this.gibletQtyRange = [300,500];
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
    pop();
    rectMode(CORNER);
  }
}

