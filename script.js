 /*
What we have here are the seeds for the levels. Each number corresponds to a grid space. Here is the legend:
blank = 0
wall = 1
coin = 2
end button = 3
start button = 4
(WIP) slow mo = 5
*/
var god=false
var havePowerUp = false
var globalspeed = 1
var levelHavePowerUp = false
var coinsArray = ['temp', 'temp1']
var continueFlag = true
var dead = 0
var godmode = false
var coincount = 0
var globalSeedIndex = 0          
var seedsArray = ['0111111111111111111111111111111111111111111111111005012100011113344001010100011334400101011101110440010101210111000000000100000001111111111111111111111111111111111111111111111111111111111111111', '02100000000000013000101001111101011110110100000100000001010111110011010101002150000101010100111101110111011010010000000000000011010110111101011000001012011101001011101101000101144410000101000000', '040001000000000010110121111111100011111100015111000011000100001001101000111110101010101013001010001010111110101100101010000010000000000010111111101111101010120010100010111011101000121000000000000',
'000000002100000000000000131000000011111100011111100120100000102100001000000000100000010100010100000010001010001000010000101000010012010100010102100111100000111100000000000000000000000004000000',
'0002111333311120000100013310001000110121001210110012011100111021001101010010101100010000000000100000110111101100000001001100100000000010000100000000000100100000000000004400000000000004444000000','0412112101111121301001000100010100110111012101010001000101110101010111010000010101000101011111010111010001000001000001011111110100111101000101010012000101000001001111000111111100000001000000000','0111111111111111111211100000000211001410101111111101101010121212110000001010101011011111101010101100000210101010110011111010101011000003100000001100111110111110110000000000002011111111111111111',                 '0211021200010001401001111101010100110012000001010010011110110101001100001111010100000010000001000101101111011111110110001001001001001011110100000101101300010000010110111101010101212012000001012','0111111111111111110001101111000111101110111101111110111000010011111011101101011111101110110100011111111111111111110001101111000111011110000101101100111011010110110111101101011011000110110100011']
//this variable sets the number of coin per each level
var coinsPerLevel = ["2", "3", "3","5","6","5","7",'8' ]
//make an animated progress bar with anime.js
const progressBar = anime({
  targets: '#progress-bar',
  width: '70px',
  duration: 2500,
  easing: 'linear',
  autoplay: false,
  update: function(anim) {
    if (anim.progress === 100) {
      anim.pause();
      progressBar.restart();
    }
  }

});
//code to detect when space bar is pressed
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    slowMo();
  }
});


/*
add presets for the location and movement of the moving blocks
format is [direction, startpos, endpos, ID, offset]
For directions:
1 = vertical moving
2 = horizontal moving
ex: level 1: [1, 52, 116, one]

new format: [direction, startpos, squaresmove, speed, ID]
*/
var movingBlockSettings = [
  ['1', '52', 4, 1000, 'first-moving-square', '2', '113', 15, 1500, 'second'], ['2', '113', 13, 1400, 'originalid', '1', '32', 6, 1500, 'anotherid'], ['1', '113', 4, 1200, 'fsd', '2', '5', 11, 1000, 'gsdh', '2', '183', 9, 1200, 'ghfs'],['2','68',10,1200,'gnil','2','115','12',1200,'glik','1','38','7',1200,'jkhy','1','44','7',1200,'hgtf'],['2','19','4',1200,'polk','1','4','6',1200,'lmkn','2','83','11',1200,'mnhf','1','13','6',1200,'ghbi','2','26','4',1200,'bfsi','2','134','5',600,'asdf'],['2','177','15',1200,'kmnj','1','54','8',1200,'asfg','2','71','6',1200,'jhvg'],['1','34',8,700,'one','2','137',6,500,'two','2','23',4,900,'th','2','165',7,1550,'g','1','111',4,2000,'dwa'],['1','4',4,300,'a','2','81',4,400,'c','1','101',5,700,'d','2','87',5,600,'e','1','122',4,450,'f','1','125',2,500,'ff','1','127',2,500,'fff','1','142',2,700,'ffff','2','40',4,500,'fffff']]
  
//INITIALIZING GAME
function startEverything(){
  GenerateDivs()
  applyBlocks()
  applyMovingBlocks()
  let thingy = document.getElementById('startme')
  thingy.disabled=true
}

function GenerateDivs() {
  //make game container
  const gamecontainercontainer = document.getElementById('gamecontainercontainer');
  const gamecontainer = document.createElement('div')
  gamecontainer.setAttribute('id','gamecontainer');
  gamecontainercontainer.appendChild(gamecontainer)
  //define div size
  //define number of rows and columnsb
  const rownumber = 12;
  const colnumber = 16;
  //define values for container
  gamecontainer.style.backgroundColor = 'white';
  gamecontainer.style.display = 'flex';
  gamecontainer.style.flexWrap = 'wrap';
  gamecontainer.style.width = colnumber * 50 + 'px';
  gamecontainer.style.height = rownumber * 50 + 'px';
  gamecontainer.style.border = '1px solid black';
  gamecontainer.addEventListener('mouseleave', WallHover);
  gamecontainer.addEventListener('contextmenu', AntiCheat);

  //make counter for ids
  let idcounter = 0
  //loop for creating divs
  for (let row = 0; row < rownumber; row++) {
    for (let col = 0; col < colnumber; col++) {
      //increase id counter
      idcounter++
      //to make divs
      const makediv = document.createElement('div');
      //define size of divs
      makediv.style.width = '50px';
      makediv.style.height = '50px';
      makediv.style.float = 'left';
      makediv.style.boxSizing = 'border-box';
      makediv.style.position = 'relative'
      //make unique id and class for the divs
      const divID = idcounter
      const divClass = 'row' + row
      //add id and classes to div
      makediv.id = divID
      makediv.classList.add(divClass);
      // not needed | makediv.style.outline = '1px solid red';
      //add the div to the container
      gamecontainer.appendChild(makediv);
    }
    //clear float after each row
    const clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    gamecontainer.appendChild(clearDiv);
  }

}

//set attributes based off of seed
function applyBlocks() {
  let seed = seedsArray[globalSeedIndex]
  for (i = 1; i < seed.length; i++) {
    let currentnumber = seed.charAt(i);
    let currentcell = document.getElementById(i)
    if (currentnumber == '1') {
      makeWallBlock(i)
    }
    else if (currentnumber == '2') {
      makeCoinBlock(i)
    }
    else if (currentnumber == '3') {
      makeEndBlock(i)
    }
    else if (currentnumber == '4') {
      makeStartBlock(i)
    }
    else if(currentnumber == '5'){
      makeSlowMo(i)
    }
    else {
      console.log('blank')
    }
  }
}

//create moving blocks based off of the movingBlockSettings array
function applyMovingBlocks(){
  let movingSeed = movingBlockSettings[globalSeedIndex]
 for (let i = 0; i < movingSeed.length; i += 5) {
    if (movingSeed[i] == '1') {
      makeYMovingDivs(movingSeed[i+1], movingSeed[i+2], movingSeed[i+3], movingSeed[i+4]);
      collisionDetect(movingSeed[i+4])
      console.log('created Y moving block at ' + movingSeed[i+1] + ', ' + movingSeed[i+2] + 'with the id '+ movingSeed[i+4]);
      console.log(movingSeed);
    } else {
      makeXMovingDivs(movingSeed[i+1], movingSeed[i+2], movingSeed[i+3], movingSeed[i+4]);
      collisionDetect(movingSeed[i+4]);
      console.log('created X moving block at ' + movingSeed[i+1] + ', ' + movingSeed[i+2]);
      console.log(movingSeed);
      
    }
  }
}
//code for checking mouse hover on moving divs
var mouse = {
  x: 0,
  y: 0
};

addEventListener("mousemove", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});
//detects when the mouse hits the walls
function collisionDetect(elementID){
  setInterval(function () {
  let elementX = getElementX(elementID)
  let elementY = getElementY(elementID)
    if (
    mouse.x >= elementX &&
    mouse.x <= elementX + 50 &&
    mouse.y >= elementY &&
    mouse.y <= elementY + 50
  ) {WallHover()}
  }, 10);

}


/*code for making a moving div -- using the library anime.js as every other method i've tried with normal JS seems to be unreliable*/
function makeXMovingDivs(startid, squaresmove, speed, idvalue){
  const startingDiv = document.getElementById(startid)
  const movingDiv = document.createElement('div');

  let Localspeed = speed * globalspeed
  let moving = squaresmove*50
  
  movingDiv.style.width = '50px';
  movingDiv.style.height = '50px';
  movingDiv.style.backgroundColor = 'red';
  movingDiv.style.position = 'absolute';
  movingDiv.id = idvalue;
  movingDiv.classList.add("movingdiv");
  movingDiv.style.zIndex = "9999";
  startingDiv.appendChild(movingDiv);

  
    anime({
 targets: '#'+idvalue,
    translateX: [
      { value: moving, duration: Localspeed, easing: 'easeInOutQuad' },
      { value: 0, duration: Localspeed, easing: 'easeInOutQuad' }
    ],
    direction: 'alternate',
    loop: true
  });
}

function makeYMovingDivs(startid, squaresmove, speed, idvalue){
  const startingDiv = document.getElementById(startid)
  const movingDiv = document.createElement('div');

  let Localspeed = speed * globalspeed
  let moving = squaresmove*50
  
  movingDiv.style.width = '50px';
  movingDiv.style.height = '50px';
  movingDiv.style.backgroundColor = 'red';
  movingDiv.style.position = 'absolute';
  movingDiv.classList.add("movingdiv");
    movingDiv.style.zIndex = "9999";
  movingDiv.id = idvalue;
  
  startingDiv.appendChild(movingDiv);

  
    anime({
 targets: '#'+idvalue,
    translateY: [
      { value: moving, duration: Localspeed, easing: 'easeInOutQuad' },
      { value: 0, duration: Localspeed, easing: 'easeInOutQuad' }
    ],
    direction: 'alternate',
    loop: true
  });
}
//get x position of element
function getElementX(elementid){
  let element = document.getElementById(elementid);
  let rect = element.getBoundingClientRect();
let x = rect.left;
return x
}
//get y position of element
function getElementY(elementid){
  let element = document.getElementById(elementid);
let rect = element.getBoundingClientRect();
  let y = rect.top
return y
}

//make slow mo powerup grid
function makeSlowMo(cell){
  let slowmo = document.getElementById(cell)
  slowmo.style.backgroundColor = 'pink'
  slowmo.style.borderRadius = '50%'
  slowmo.setAttribute("id", "slowmo")
  const boundOnSlowMoHover = onSlowMoHover.bind(slowmo);
  slowmo.addEventListener('mouseover', boundOnSlowMoHover)
}

//code to get power up on hover
function onSlowMoHover(){
  if(levelHavePowerUp == false && !dead){
    console.log('power up GET')
havePowerUp = true
levelHavePowerUp = true
let hovered = document.getElementById(this.id)
hovered.style.opacity = '0'
      document.getElementById('powernumber').innerHTML = '1'
  }
}

//function names self explanatory
function makeStartBlock(startID) {
  let startbutton = document.getElementById(startID)
  startbutton.style.backgroundColor = 'blue';
  startbutton.addEventListener('click', StartClick)

}
function makeWallBlock(cell) {
  let wallblock = document.getElementById(cell)
  wallblock.style.backgroundColor = 'black'
  wallblock.classList.add('wall');
  wallblock.addEventListener("mouseover", WallHover)
}
function makeCoinBlock(cell) {
  let coinblock = document.getElementById(cell)
   coinblock.classList.add('coin');
  coinblock.style.backgroundColor = 'yellow'
coinblock.addEventListener("mouseover", CoinHover.bind(coinblock));
}

function makeEndBlock(cell, endSeed) {
  let endblock = document.getElementById(cell)
  endblock.style.backgroundColor = 'green'
  endblock.addEventListener("click", doEnd)
}

//code for when the end button is clicked
function doEnd(){
  //check how many coins are needed for the level
  let neededCoins = (parseInt(coinsPerLevel[globalSeedIndex])+2)
  console.log(neededCoins)
  console.log(coinsArray.length)
  //if you have the amount of coins you need and are not dead (or if you have godmode enabled)
  if(neededCoins == coinsArray.length && !dead || god==true){
    //globalseedindex controls what level is generated
  globalSeedIndex++
    //clear all intervals from moving divs
  for(i=0; i<100; i++)
{
    window.clearInterval(i);
}

    //delete game contaner
  let container = document.getElementById('gamecontainer')
  container.remove();
  //this makes new container and applies new seed
  GenerateDivs()
  applyBlocks()
  WallHover()
    //clear logged coins
   while (coinsArray.length > 2) {
  coinsArray.splice(2, 1);
 }
  
    applyMovingBlocks()
     anime.running.forEach(function (animation) {
    animation.pause();
  });
  //change global speed
  anime.speed = 1
  //resume all animations
   anime.running.forEach(function (animation) {
    animation.play();
  });
  }
    //if dead alert
  else if(dead){ alert('try again when you are not dead')}
  else if(!dead && coinsArray.length != neededCoins){
    alert('try again after collecting all the coins')
  }
  
}
function WallHover(){
  console.log('You Died')
  const gcc = document.getElementById('gamecontainercontainer')
  gcc.style.backgroundColor = 'red'
  dead = true
}

function slowMo(){
  if (havePowerUp == true && !dead){
    havePowerUp = false
    document.getElementById('powernumber').innerHTML = '0'
  console.log('slowmo activated')
  //pause all animations
 anime.running.forEach(function (animation) {
    animation.pause();
  });
  //change global speed
  anime.speed = 0.5
  //resume all animations
   anime.running.forEach(function (animation) {
    animation.play();
  });
    progressBar.play();
setTimeout(function() {
  //wait 5 seconds then go back to normal speed
//pause all animations
 anime.running.forEach(function (animation) {
    animation.pause();
  });
  //change global speed
  anime.speed = 1
  //resume all animations
   anime.running.forEach(function (animation) {
    animation.play();
  });
  document.getElementById('progress-bar').style.width = '0%'
}, 5000);

    
  }
  else{console.log('u need power up')}
}

function CoinHover(event){
  //define the specific coin that is hovered  
  let hoveredcoin = document.getElementById(this.id)
  for (let i = 0 ; i<coinsArray.length; i++){
//code to make sure the specific coin only is added to the array once.
//if hovered coin is already present in array, do not proceed
    if(coinsArray[i] == this.id){
      continueFlag = false
      break;
    }
  }
  if(!dead && continueFlag==true){
    //add hovered coin to coins array
  coinsArray.push(this.id)
  }
  else{
    continueFlag = true
  }
  
if(!dead){
  hoveredcoin.style.opacity = '0'
  hoveredcoin.removeEventListener("mouseover", CoinHover);}
}
  
function StartClick(){
  //make bg white 
   const gcc = document.getElementById('gamecontainercontainer')
     gcc.style.backgroundColor = 'white'
  //make coins reappear
let coins = document.getElementsByClassName('coin')
  dead = false
  for (let i = 0; i < coins.length; i++) {
  coins[i].style.opacity = '1';
}
  //remove previously collected coins from array
 while (coinsArray.length > 2) {
  coinsArray.splice(2, 1);
 }
  
  levelHavePowerUp = false
  havePowerUp = false
  document.getElementById('powernumber').innerHTML = '0'
  document.getElementById('slowmo').style.opacity = '100'


}
function AntiCheat(){
  const confirmationthing = confirm('Did you just try to cheat? (OK if yes, Cancel if no) ')
  if(confirmationthing == true){
    alert('jumpscare')
    WallHover()
  }
  else{
    alert("Don't try that again, right clicking breaks the game.")
    WallHover()
  }
}

function levelSwitch(){
   neededCoins = 0
   neededCoins = parseInt(coinsArray.length)
  god = true
  doEnd()
}

function tutorial(){
  alert('This is a simple mouse-controlled maze game! Touching the walls or the moving blocks will kill you. Click the blue button to respawn. After collecting all the coins, click the green button to go to the next level! You can activate your power-up by pressing the space bar!')
}
