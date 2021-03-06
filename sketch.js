
var gm;
var playr;
var foodies;
var pauseMenu;
var settingsMenu;
var controlsMenu;
var gameplayMenu;
var colorsMenu;
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
  foodies = new Array();
  for(var i=0; i<gm.settings.getFoodieQty();i++)
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
  setupColorsMenu();
}

function setupPauseMenu() {
  pauseMenu = new menu("PAUSED");
  pauseMenu.addMenuItem("Snek Time", new Function('gm.status = "GO"'), []);
  pauseMenu.addMenuItem("Snek Settings", new Function('gm.status = "SETTINGS";'), []);
  pauseMenu.addMenuItem("Quit Snekking", new Function('window.close();'), []); 
}
function setupSettingsMenu(){
  settingsMenu = new menu("SETTINGS");
  settingsMenu.addMenuItem("Back 2 Snek Pause", new Function('gm.status = "PAUSED"'), []);
  settingsMenu.addMenuItem("Snek Gameplay", new Function('gm.status = "SETTINGS_Gameplay"'), []);
  settingsMenu.addMenuItem("Snek Colurz", new Function('gm.status = "SETTINGS_Colors";'),[]);
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
  gameplayMenu.addMenuItem("Foodie Qty", new Function('this.selectPress("foodieQty");'), gm.settings.foodieQtys);
  gameplayMenu.addMenuItem("Giblet Quantity", new Function('this.selectPress("gibletQty");'), gm.settings.gibletQtys);
}
function setupColorsMenu(){
  colorsMenu = new menu("Snek Colurz");
  colorsMenu.addMenuItem("Back to Settings", new Function('gm.status = "SETTINGS";'), []);
}

function keyPressed() {
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
  else if(gm.status == "LOST" && gm.deathGiblets.length == 0)
    gm.reset();
  else if(gm.status == "SETTINGS_Colors"){
    colorsMenu.keyPress(keyCode);
  }
}

function touchStarted(){
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
  if(gm.status == "LOST"){
    background(gm.background);
    playr.draw();
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
    this.foodieQty = "Medium";
    this.foodieQtys = ["Low", "Medium", "High"];
    this.foodieQtyLookup = {"Low":5, "Medium":10, "High":20};
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
  getFoodieQty(){
    return this.foodieQtyLookup[this.foodieQty];
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
    this.score = 0;
    this.deathGiblets = []
  }
  get xscale() {
    return this.cnvWidth/this.gridWidth;
  }
  get yscale() {
    return this.cnvHeight*(59/60)/this.gridHeight;
  }
  draw(){  
    this.drawScore();
    this.drawPowerupBar();
    this.drawBlinkAmmo();
    if(this.status == "LOST")
    {
      this.drawGameOver();
      this.drawSnakeSplosion();
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
    if(this.status == "SETTINGS_Colors"){
      colorsMenu.draw();
    }
  }
  drawSnakeSplosion(){
    if(playr.tail.length > 0){
      var pieceOfTail;
      pieceOfTail = playr.tail.splice(playr.tail.length-1,1);
      this.spawnGiblets(pieceOfTail[0]);
    }
    for(var i=0;i<this.deathGiblets.length;i++){
      this.deathGiblets[i].update();
      this.deathGiblets[i].draw();
      if(this.deathGiblets[i].deleteMe)
        this.deathGiblets.splice(i,1);
    }
  }
  spawnGiblets(pieceOfTail){
    var numberOfGiblets = floor(random()*(gm.settings.getGibletQty()[1]-gm.settings.getGibletQty()[0]) +gm.settings.getGibletQty()[0]);//10-15;
    for(var i=0;i<numberOfGiblets;i++)
    {
      this.deathGiblets.push(new foodieGiblet(pieceOfTail[0],pieceOfTail[1],'black'));
    }
  }
  drawBlinkAmmo(){
    fill(120,0,120);
    for(var i=0;i<playr.blinkAmmo;i++){
      rect(this.cnvWidth*((59-i)/60),this.cnvHeight*(57/60),this.cnvWidth/120,this.cnvHeight*(3/60));
    }
  }
  drawPowerupBar(){
    fill(0,0,0);
    rect(0,this.cnvHeight*(59/60),this.cnvWidth,this.cnvHeight);
    var remainingPower = playr.powerupTimeRemaining/playr.powerupTimeMax;
    fill(255,255,255);
    rect((1-remainingPower)*(this.cnvWidth/2),this.cnvHeight*(59/60),(remainingPower)*this.cnvWidth,this.cnvHeight);
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
    text("SCORE: " + (gm.score) + "    Length: " + playr.tail.length,0,0,gm.cnvWidth,100);
  }
  drawGameOver(){
      textAlign(LEFT);
      textSize(gm.cnvWidth/15)
      text("GAME OVER", gm.cnvWidth/3.5, gm.cnvHeight/2)
  }
  reset(){
    gm.status = "GO";
    this.score = 0;
    this.gridWidth = this.settings.getGridSize()[0];
    this.gridHeight = this.settings.getGridSize()[1];
    this.background = [120,120,120];
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
    if(gm.settings.tapMode == "Absolute"){
      if(x > this.cnvWidth/2)
        horizontal = "RIGHT";
      else
        horizontal = "LEFT";
      if(y > this.cnvHeight/2)
        vertical = "DOWN";
      else
        vertical = "UP";
    }
    else{
      if(x > playr.x*gm.xscale)
        horizontal = "RIGHT";
      else
        horizontal = "LEFT";
      if(y > playr.y*gm.yscale)
        vertical = "DOWN";
      else
        vertical = "UP";
    }
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
   this.bodyColorsBase = ['yellow','red','red','yellow','black','black'];
   this.bodyColors = this.bodyColorsBase.slice();
   this.tailQueue = 0;

   this.powerup = "None";
   this.blinkAmmo = 3;
   this.blinkAmmoMax = 3;
   this.powerupTimeRemaining = 0;
   this.powerupTimeMax = 80;
  }
  update(){
    this.updateLocation();
    this.checkOutOfBounds();
    this.addQueuedTail();
    this.moveSnakePieces();
    this.checkTailCollision();
    if(gm.status == "LOST")
        audio.die.play();
    this.powerDown();  
  }
  draw(){
    this.setBodyColors();
    this.drawHeads();
    this.drawBodyAndTail();
  }
  getPoint(){
    gm.score++;
    if(this.powerup == "Shrinkage"){
      if(this.tailQueue > 0)
        this.tailQueue--;
      else{
        if(playr.tail.length>1)
          playr.tail.splice(playr.tail.length-1,1);
          this.length--;
      }
    }
    else
      this.tailQueue++;
  }
  updateLocation(){
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
  }
  powerDown(){
    if(this.powerup != "None"){
      this.powerupTimeRemaining--;
      if(this.powerupTimeRemaining <= 0)
        this.powerup = "None";
    }
  }
  moveSnakePieces(){
    for(var i=this.length-1;i>0;i--)
    {
        this.tail[i] = this.tail[i-1];
    }
    this.tail[0] = new Array(this.x,this.y);
  }
  addQueuedTail(){
    if(this.tailQueue > 0){
      this.length++;
      this.tailQueue--;
    }
  }
  checkOutOfBounds(){
    if(this.x < 0 || this.y < 0 || this.x > gm.gridWidth-1 || this.y > gm.gridHeight-1)
    {
      if(this.powerup != "Trippin")
        gm.status = "LOST";
      else{
        if(this.x<0)
          this.x = gm.gridWidth - 1;
        else if(this.y<0)
          this.y = gm.gridHeight - 1;
        else if(this.x > gm.gridWidth - 1)
          this.x = 0;
        else
          this.y = 0;
      }
    }
  }
  checkTailCollision(){
    if(this.powerup != "Trippin"){
      for(var i=1;i<this.tail.length;i++)
      {
        if(this.tail[0][0]==this.tail[i][0] && this.tail[0][1] == this.tail[i][1])
          gm.status = "LOST";
      }
    }
  }
  addPowerupTime(time){
    this.powerupTimeRemaining += time;
    if(this.powerupTimeRemaining > this.powerupTimeMax)
      this.powerupTimeRemaining = this.powerupTimeMax;
  }
  setBodyColors(){
    if(this.powerup == "Trippin"){
      for(var i=0;i<20;i++){
        this.bodyColors[i] = this.getRandomColor();
      }
    }
    else
      this.bodyColors = this.bodyColorsBase.slice();
  }

  drawBodyAndTail(){
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
  drawHeads(){
    var headColor = this.getRandomColor();
    this.drawHead(headColor,this.x,this.y);
    if(this.powerup == "Hydra")
      this.drawHydraHeads(headColor);
  }
  drawHydraHeads(headColor){
      var heads = this.getHeadLocations();
      for(var i=0;i<5;i++){
        this.drawHead(headColor,heads[i][0],heads[i][1]);
      }
  }
  drawHead(color,x,y){
    fill(color);
    var scaledx = x*gm.xscale;
    var scaledy = y*gm.yscale;
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
  getHeadLocations(){
    var heads = [];
    if(this.powerup != "Hydra")
      return [[this.x,this.y]];
    else{
      if(this.direction == "LEFT" || this.direction == "RIGHT"){
        for(var i=-2;i<3;i++){
          heads[i+2] =[this.x,this.y+i];
        }
      }
      else{
        for(var i=-2;i<3;i++){
          heads[i+2] = [this.x+i,this.y];
        }
      }
    }
    return heads;
  }
  getRandomColor(){
    return [random()*255,random()*255,random()*255];
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
    if(key == 16) //LeftShift
      this.blink(4);
    if(key == 32)
      gm.status = "PAUSED";
  }
  translateVimKeys(key){
    return gm.settings.keyboardModeVIMLookup[key];
  }
  mousePress(quadrant){
    if(playr.direction == "RIGHT" || playr.direction == "LEFT")
      playr.direction = quadrant[1];
    else
      playr.direction = quadrant[0];
  }
  addBlinkAmmo(){
    this.blinkAmmo++;
    if(this.blinkAmmo > this.blinkAmmoMax)
      this.blinkAmmo = this.blinkAmmoMax;
  }
  blink(distance){
    if(this.blinkAmmo > 0){
      if(this.direction == "RIGHT")
        this.x += distance;
      if(this.direction == "LEFT")
        this.x -= distance;
      if(this.direction == "DOWN")
        this.y += distance;
      if(this.direction == "UP")
        this.y -= distance;
      this.blinkAmmo--;
    }
  }
}

class foodie {
  constructor (){
    this.x = (floor(random()*gm.gridWidth));
    this.y = (floor(random()*gm.gridHeight));
    this.color = [random()*255,random()*255,random()*255];
    this.gibletQtyRange = gm.settings.getGibletQty();
    this.powerup = this.getPowerup();
  }
  draw(){ 
    fill(this.color);
    if(this.powerup == "Hydra")
      ellipse((this.x+.5)*gm.xscale,(this.y+.5)*gm.yscale,gm.xscale,gm.yscale);
    else if(this.powerup == "Trippin"){
      ellipse((this.x+.5)*gm.xscale,(this.y+.5)*gm.yscale,gm.xscale/4,gm.yscale);
      ellipse((this.x+.5)*gm.xscale,(this.y+.5)*gm.yscale,gm.xscale,gm.yscale/4);
    }
    else if(this.powerup == "Shrinkage"){
      ellipse((this.x+.5)*gm.xscale,(this.y+.5)*gm.yscale,gm.xscale/2*(.5+random()),gm.yscale/2*(.5+random()));
    }
    else if(this.powerup == "Magnet"){
      ellipse((this.x+.4)*gm.xscale,(this.y+.5)*gm.yscale,gm.xscale/5,gm.yscale);
      ellipse((this.x+.6)*gm.xscale,(this.y+.5)*gm.yscale,gm.xscale/5,gm.yscale);
    }
    else if(this.powerup == "Blink"){
      triangle((this.x)*gm.xscale,this.y*gm.yscale,(this.x+.5)*gm.xscale,(this.y+1)*gm.yscale,(this.x+1)*gm.xscale,this.y*gm.yscale);
    }
    else
      rect(this.x*gm.xscale,this.y*gm.yscale,gm.xscale,gm.yscale);
  }
  update(){
    this.updateLocation();
    this.checkForEating();
    if(this.powerup == "SuperNom")
      this.changeColor()
  }
  updateLocation(){
    if(playr.powerup == "Magnet" && this.powerup == "Normal"){
      var xdiff = playr.x - this.x;
      var ydiff = playr.y - this.y;
      if(ydiff != 0 && xdiff != 0){
        if(Math.abs(xdiff) > Math.abs(ydiff)){
          this.x = this.x + (xdiff/Math.abs(xdiff));
        }
        else
          this.y = this.y + (ydiff/Math.abs(ydiff));
      }
    }
  }
  checkForEating(){
    var heads = playr.getHeadLocations();
    for(var i=0;i<heads.length;i++){
      if(this.x == heads[i][0] && this.y == heads[i][1]){
        this.getEaten();
      }
    }
  }
  getEaten(){
    this.spawnGiblets();
    gm.background = [random()*255,random()*255,random()*255];
    this.absorbPower();
    this.reset();
    playr.getPoint();
    audio.eat.play();
  }
  absorbPower(){
    if(this.powerup == "SuperNom"){
      for(var i=0;i<foodies.length;i++){
        if(foodies[i].powerup == "Normal")
          foodies[i].getEaten();
      }
    }
    else if(this.powerup == "Blink"){
      playr.addBlinkAmmo();
      playr.addPowerupTime(20);
    }
    else if(this.powerup == "Yum"){
      for(var i=0;i<10;i++){
        foodies.push(new foodie());
      }
    }
    else if(this.powerup != "Normal"){
      if(playr.powerup == "None")
        playr.powerup = this.powerup;
      playr.addPowerupTime(20);
    }
    else
      playr.addPowerupTime(3);
  }
  reset(){
    this.x = (floor(random()*gm.gridWidth));
    this.y = (floor(random()*gm.gridHeight));
    this.changeColor();
    this.powerup = this.getPowerup();
  }
  spawnGiblets(){
    var numberOfGiblets = floor(random()*(this.gibletQtyRange[1]-this.gibletQtyRange[0]) +this.gibletQtyRange[0]);//10-15;
    for(var i=0;i<numberOfGiblets;i++)
    {
      foodieGiblets.push(new foodieGiblet(this.x,this.y,this.color));
    }
  }
  changeColor(){
    this.color = [random()*255,random()*255,random()*255];
  }
  getPowerup(){
    var rnd = floor(random()*100);
    if(rnd < 5)
      return "SuperNom";
    else if(rnd<10)
      return "Hydra";
    else if(rnd<15)
      return "Trippin";
    else if(rnd<20)
      return "Shrinkage";
    else if(rnd<25)
      return "Magnet";
    else if(rnd<30)
      return "Yum";
    else
      return "Normal";
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

