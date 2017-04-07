
var gm;
var playr;
var foodies;
var pauseMenu;
var settingsMenu;
var controlsMenu;
var gameplayMenu;
var audio;

function preload() {
  audio = new sounds();
  gm = new game(48,24,window.innerWidth,window.innerHeight, new settings());
}

function setup() {
  createCanvas(gm.cnvWidth, gm.cnvHeight);
  frameRate(20);

  playr = new snake(1,1);

  setupFoodies();
  setupMenus();
}

function setupFoodies() {
  foodies = new Array(10);
  for(var i=0; i<foodies.length;i++)
  {
    foodies[i] = new foodie();
  }
  foodieGiblets = [];
}

function setupMenus() {
  setupPauseMenu();
  setupSettingsMenu();
  setupControlsMenu();
  setupGameplayMenu();
}

function setupPauseMenu() {
  pauseMenu = new menu("PAUSED");
  pauseMenu.addMenuItem("Resume Snekking", new Function('gm.status = "GO"'), []);
  pauseMenu.addMenuItem("Snek Settings", new Function('gm.status = "SETTINGS";'), []);
  pauseMenu.addMenuItem("Quit Snekking", new Function('window.close();'), []); 
}
function setupSettingsMenu(){
  settingsMenu = new menu("SETTINGS");
  settingsMenu.addMenuItem("Back 2 Snek Pause", new Function('gm.status = "PAUSED"'), []);
  settingsMenu.addMenuItem("Snek Gameplay", new Function('gm.status = "SETTINGS_Gameplay"'), []);
  settingsMenu.addMenuItem("Snekky Controls", new Function('gm.status = "SETTINGS_Control";'), []);
}
function setupControlsMenu(){
  controlsMenu = new menu("CONTROLS");
  controlsMenu.addMenuItem("Bak 2 Snek Settingz", new Function('gm.status = "SETTINGS";'), []);
  controlsMenu.addMenuItem("Keyboard Mode", new Function('this.selectPress("keyboardMode");'), gm.settings.keyboardModes);
  controlsMenu.addMenuItem("Tap Mode", new Function('this.selectPress("tapMode");'), gm.settings.tapModes);
}
function setupGameplayMenu(){
  gameplayMenu = new menu("GAMEPLAY");
  gameplayMenu.addMenuItem("Back to Settings", new Function('gm.status = "SETTINGS";'), []);
  gameplayMenu.addMenuItem("Grid Size", new Function('this.selectPress("gridSize");'), gm.settings.gridSizes);
  gameplayMenu.addMenuItem("Giblet Quantity", new Function('this.selectPress("gibletQty");'), gm.settings.gibletQtys);
}

function keyPressed()
{
  if(gm.status == "GO"){
    playr.keyPress(keyCode);
  }
  else if(gm.status == "PAUSED") {
    pauseMenu.keyPress(keyCode);
  }
  else if(gm.status == "SETTINGS") {
    settingsMenu.keyPress(keyCode);
  }
  else if(gm.status == "SETTINGS_Control") {
    controlsMenu.keyPress(keyCode);
  }
  else if(gm.status == "SETTINGS_Gameplay"){
    gameplayMenu.keyPress(keyCode);
  }
  else if(gm.status == "LOST")
    gm.reset();
}

function touchEnded(){
  if(gm.status == "GO"){
    gm.mousePress(mouseX,mouseY);
  }
}

function windowResized() {
  gm.cnvWidth = window.innerWidth;
  gm.cnvHeight = window.innerHeight;
  resizeCanvas(gm.cnvWidth,gm.cnvHeight);
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
  for(var i=0;i<foodieGiblets.length;i++){
    foodieGiblets[i].update();
    foodieGiblets[i].draw();
    if(foodieGiblets[i].deleteMe)
      foodieGiblets.splice(i,1);
  }
}
function updateAndDrawFoodies(){
  foodies.forEach(function(entry) {
    entry.update();
    entry.draw();
  }, this);
}

class sounds {
  constructor(){
    soundFormats("mp3","wav");
    this.die = loadSound("sounds/08 - MegamanDefeat.wav");
    this.eat = loadSound("sounds/09 - EnemyDamage.wav");
  }
}

class settings {
  constructor() {
    this.gibletQty = "Normal";
    this.gibletQtys = ["Normal", "Retarded"];
    this.gibletQtyLookup = {"Normal":[20,30], "Retarded":[100,300]};
    this.gridSize = "Medium";
    this.gridSizes = ["Small", "Medium", "Large"];
    this.gridSizeLookup = {"Small":[36,18], "Medium":[48,24], "Large":[72,36]};
    this.keyboardMode = "Arrow";
    this.keyboardModes = ["Arrow", "Vim"];
    this.keyboardModeVIMLookup = {72:LEFT_ARROW, 74:UP_ARROW, 75:DOWN_ARROW, 76:RIGHT_ARROW};
    this.tapMode = "Relative";
    this.tapModes = ["Absolute", "Relative"];
  }
  getGridSize(){
    return this.gridSizeLookup[this.gridSize];
  }
  getGibletQty(){
    return this.gibletQtyLookup[this.gibletQty];
  }
}

class game {
  constructor(gridWidth,gridHeight,cnvWidth,cnvHeight, settings){
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.cnvWidth = cnvWidth;
    this.cnvHeight = cnvHeight;
    this.status = "GO";
    this.background = [120,120,120];
    this.backgroundChangeRate = [20,20,20];
    this.settings = settings;
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
    if(this.status == "SETTINGS_Control"){
      controlsMenu.draw();
    }
    if(this.status == "SETTINGS_Gameplay"){
      gameplayMenu.draw();
    }
  }
  updateBackground(){
    for(var i=0;i<3;i++){
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
    gm.status = "GO";
    this.gridWidth = this.settings.getGridSize()[0];
    this.gridHeight = this.settings.getGridSize()[1];
    setup();
  }
  mousePress(x, y){
    if(this.status == "GO") {
      playr.mousePress(this.getMousePressQuadrant(x, y));
    }
  }
  getMousePressQuadrant(x, y){
    var horizontal;
    var vertical;
    if(x > this.cnvWidth/2)
      horizontal = "RIGHT";
    else
      horizontal = "LEFT";
    if(y > this.cnvHeight/2)
      vertical = "DOWN";
    else
      vertical = "UP";
    return [horizontal,vertical];
  }
}

class menu {
  constructor (title){
    this.title = title;
    this.menuItems = new Array();
    this.selectedItem = 0;
  }
  addMenuItem(textual,funct, selection)
  {
    this.menuItems[this.menuItems.length] = new menuItem(textual, funct, selection);
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
    rect(gm.cnvWidth/5,gm.cnvHeight/6,gm.cnvWidth*(3/5),gm.cnvHeight*(2/3))
  }
  drawTitle(){
    fill(0,102,153);
    textAlign(CENTER);
    textSize(gm.cnvWidth/15);
    text(this.title, gm.cnvWidth/2,gm.cnvHeight/3);
  }
  drawMenuItems(){
    for(var i=0;i<this.menuItems.length;i++)
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
  constructor(textual, funct, selects)
  {
    this.textual = textual;
    this.funct = funct;
    //this.selections = [];
    var selected = 0;
    if(typeof selects != 'undefined'){
      this.selections = selects;
    }
    else 
      this.selections = []
    this.selection = selected;
  }
  draw(slot,selectedItem){
    textAlign(CENTER);
    
    if(this.selections.length > 0){
      textAlign(LEFT);
      this.drawSelections(slot);
      textAlign(RIGHT);
    }
    if(slot == selectedItem)
      fill(120,120,30);
    else
      fill(0,102,153);
    textSize(gm.cnvWidth/30);
    text(this.textual, gm.cnvWidth/2, gm.cnvHeight/3 + (slot+1.5)*gm.cnvHeight/12);

  }
  drawSelections(slot){
    for(var i=0;i<this.selections.length;i++){
      var color;
      if(i == this.selection){
        color = [120,120,30];
      }
      else
        color = [0,102,153];
      fill(color);
      textSize(gm.cnvWidth/40);
      text(this.selections[i], gm.cnvWidth/2+(i+.5)*gm.cnvWidth/8,gm.cnvHeight/3 + (slot+1.5)*gm.cnvHeight/12);
    }
  }
  selectPress(option){
    this.selection++;
    if(this.selection > this.selections.length - 1)
      this.selection = 0;
    for(var propName in gm.settings) {
      if(propName == option) {
         gm.settings[propName] = this.selections[this.selection];
      }
   }
  }
}

class snake {
  constructor (x, y){
   this.x = x;
   this.y = y;
   this.direction = "RIGHT";
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
    for(var i=this.length-1;i>0;i--)
    {
        this.tail[i] = this.tail[i-1];
    }
    this.tail[0] = new Array(this.x,this.y);
    if(this.x < 0 || this.y < 0 || this.x > gm.gridWidth-1 || this.y > gm.gridHeight-1)
    {
      gm.status = "LOST";
      audio.die.play();
    }
    for(i=1;i<this.tail.length;i++)
    {
      if(this.tail[0][0]==this.tail[i][0] && this.tail[0][1] == this.tail[i][1])
        gm.status = "LOST";
    }
    if(gm.status == "LOST")
        audio.die.play();
  }
  draw(){
    this.drawHead('black');
    for(var i=1;i<this.tail.length;i++)
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
    if(gm.settings.keyboardMode == "Vim")
      key = this.translateVimKeys(key);
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
  translateVimKeys(key){
    return gm.settings.keyboardModeVIMLookup[key];
  }
  mousePress(quadrant){
    if(playr.direction == "RIGHT")
      playr.direction = quadrant[1];
    else if(playr.direction == "LEFT")
      playr.direction = quadrant[1];
    else
      playr.direction = quadrant[0];
  }
}

class foodie {
  constructor (){
    this.x = (floor(random()*gm.gridWidth));
    this.y = (floor(random()*gm.gridHeight));
    this.color = [random()*255,random()*255,random()*255];
    this.gibletQtyRange = gm.settings.getGibletQty();
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
    for(var i=0;i<numberOfGiblets;i++)
    {
      foodieGiblets.push(new foodieGiblet(this.x,this.y,this.color));
    }
    this.x = (floor(random()*gm.gridWidth));
    this.y = (floor(random()*gm.gridHeight));
    gm.background = [random()*255,random()*255,random()*255];
    this.changeColor();
    playr.length++;
    audio.eat.play();
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
    this.size = (gm.xscale+gm.yscale)/((4)*(1+random()));
    this.rotateSpeed = (1+random()*8)*Math.PI/6;
    this.angle = random()*2*Math.PI;
  }  
  update() {
    this.x = this.x + Math.cos(this.direction)*this.speed;
    this.y = this.y + Math.sin(this.direction)*this.speed;
    this.angle = this.angle += this.rotateSpeed;
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

