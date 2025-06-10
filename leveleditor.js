if(document.getElementById('yomama').innerHTML == 'Level Editor!'){document.addEventListener('DOMContentLoaded', generateEditorDivs)}
//define variables
var movingArray = []
var direction;
var blocksToMove;
var blockName;
var speedvalue;
var usercreatedseed = ''
var selectedPlacement = 0
function generateEditorDivs(){
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
  gamecontainer.setAttribute("draggable", false);
  gamecontainer.style.display = 'flex';
  gamecontainer.style.flexWrap = 'wrap';
  gamecontainer.style.width = colnumber * 50 + 'px';
  gamecontainer.style.height = rownumber * 50 + 'px';
  gamecontainer.style.border = '5px solid black';
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
      makediv.setAttribute("draggable", false);
      makediv.style.backgroundColor = 'white';
      //make unique id and class for the divs
      const divID = idcounter
      const divClass = '0'
      //add id and classes to div
      makediv.id = divID
      makediv.classList.add(divClass);
      makediv.style.outline = '1px solid red';
      makediv.addEventListener('mousedown', function() {
        editorClick(divID);
      });
      makediv.addEventListener('mousemove', function() {
        editorClick(divID);
      });
      //add the div to the container
      gamecontainer.appendChild(makediv);
    }
    //clear float after each row
    const clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    gamecontainer.appendChild(clearDiv);
  }
  const body = document.querySelector('body');
body.addEventListener('dragstart', function(event) {
  event.preventDefault();
});
}

function setSelect(block){
  if(block == 'blank'){
    selectedPlacement = 0
  }
  if(block == 'wall'){
    selectedPlacement = 1
  }
  else if(block == 'coin'){
    selectedPlacement = 2
  }
  else if(block == 'end'){
    selectedPlacement = 3
  }
 else if(block == 'start'){
    selectedPlacement = 4
  }
  else if(block == 'power'){
    selectedPlacement = 5
  }
  else if(block == 'moving'){
    selectedPlacement = 6
  }
  else{console.log('error')}
  console.log('selectedPlacement is ' + selectedPlacement + block)
}


function editorClick(id) {
  var grid = document.getElementById(id);

  if (event.type === 'mousemove' && event.buttons === 1 || event.type === 'mousedown') {
    grid.className = selectedPlacement;

    if (selectedPlacement === 0) {
      grid.style.backgroundColor = 'white';
    } else if (selectedPlacement === 1) {
      grid.style.backgroundColor = 'black';
    } else if (selectedPlacement === 2) {
      grid.style.backgroundColor = 'yellow';
    } else if (selectedPlacement === 3) {
      grid.style.backgroundColor = 'green';
    } else if (selectedPlacement === 4) {
      grid.style.backgroundColor = 'blue';
    } else if (selectedPlacement === 5) {
      grid.style.backgroundColor = 'pink';
    } else if (selectedPlacement === 6) {
      if (document.getElementById(blockName) === null) {
        if (blocksToMove > 0) {
          if (speedvalue > 0) {
            if (direction === 'horizontal') {
              makeXMovingDivs(id, blocksToMove, speedvalue, blockName);
              movingArray.push('2', id, blocksToMove, speedvalue, blockName);
              console.log(movingArray);
            } else if (direction === 'vertical') {
              makeYMovingDivs(id, blocksToMove, speedvalue, blockName);
              movingArray.push('1', id, blocksToMove, speedvalue, blockName);
              console.log(movingArray);
            } else {
              alert('You must choose a direction.');
              return;
            }
          } else {
            alert('You must choose a valid speed.');
            return;
          }
        } else {
          alert('You must choose a valid amount of blocks to move.');
          return;
        }
      } else if (document.getElementById(blockName).id == blockName){
        alert('You may have not chosen a unique name. If a block is placed, ignore this message');
        return;
      }
    }
  }
}
function nextStep(){
  selectedPlacement = 6
  newseed = '0'
  for(i = 1; i<193; i++){
    let currentspace = document.getElementById(i.toString())
    newseed = newseed + currentspace.className
  }
usercreatedseed = newseed
  //clear info column
let infocolumn = document.getElementById('infocolumn')
infocolumn.innerHTML = '<p>moving div direction</p><input type="radio" id="horizontal" name="fav_language" value="horizontal"><label for="horizontal">right</label><input type="radio" id="vertical" name="fav_language" value="vertical"><label for="vertical">down</label> </p><br><label for="blocksmove">How many blocks to move:</label><br><input type="text" id="blocksmove" name="blocksmove"><br><br> <label for="blockname">Block name(make sure it is UNIQUE and includes NO SPECIAL CHARACTERS):</label><br><input type="text" id="blockname" name="blockname"><br><br><p>Moving block speed in miliseconds (higher is slower)'
  //make speed slider
  const slider = document.createElement('input')
  slider.type = 'range'
  slider.id = 'slider'
  slider.min = '50'
  slider.max = '3000'
  slider.step = '50'

  //make display element
const valueDisplay = document.createElement('p')
valueDisplay.id = 'value'
valueDisplay.textContent = '0'

  //append
  infocolumn.appendChild(slider)
  infocolumn.appendChild(valueDisplay)

  //add js for slider
  slider.addEventListener('input', function(){
    var myValue = parseInt(this.value)
    valueDisplay.textContent = myValue
  })

//make button
  const applybutton = document.createElement('button')
  applybutton.id = 'apply'
  applybutton.classList.add('cssbutton')
  applybutton.addEventListener('click', applyDetails)
  applybutton.textContent = 'Apply settings'
  infocolumn.appendChild(applybutton)

  //make new button
  const clearbutton = document.createElement('button')
  clearbutton.id = 'clear'
  clearbutton.classList.add('cssbutton')
  clearbutton.addEventListener('click', clearMoving)
  clearbutton.textContent = 'CLEAR DIVS'
  infocolumn.appendChild(clearbutton)
  //make export button
  const exporta = document.createElement('button')
  exporta.id = 'export'
  exporta.classList.add('cssbutton')
  exporta.addEventListener('click', exportAll)
  exporta.textContent = 'Export!'
  infocolumn.appendChild(exporta)
}

function applyDetails(){
  //check direction
    const horizontalRadio = document.getElementById('horizontal')
  const verticalRadio = document.getElementById('vertical')
  if (horizontalRadio.checked) {
    direction = 'horizontal'
  } else if (verticalRadio.checked) {
    direction = 'vertical'
  } else {
    //end function
    alert('Please select a direction.')
    return;
  }

  //get blocks to move
  const blocksMoveInput = document.getElementById('blocksmove');
   blocksToMove = parseInt(blocksMoveInput.value);
  if (isNaN(blocksToMove) || blocksToMove <= 0) {
    alert('Please enter a valid number of blocks to move.');
    return;
  }

   // Get the block name
  const blockNameInput = document.getElementById('blockname');
  blockName = blockNameInput.value.trim();
  if (blockName === '') {
    alert('Please enter a block name.');
    return;
  }
//speed
  const slider = document.getElementById('slider')
  speedvalue = parseInt(slider.value)

  //finalization
  console.log('Direction:', direction);
  console.log('Blocks to move:', blocksToMove);
  console.log('Block name:', blockName);
  console.log('Speed:', speedvalue);

  alert('Settings applied successfully. Click on a cell to place your moving blocks');
}

function clearMoving(){
  const result = confirm("Are you sure you want to DELETE ALL MOVING DIVS?");
  if (result === true) {
  movingArray.splice(0);
  const elements = document.querySelectorAll(".movingdiv");

// Remove each element
elements.forEach(element => {
  element.remove();
});}
  else{
    return;
  }
}
function exportAll(){
  alert('Your final seed will appear at the bottom of the page. Copy it and paste it in the level player to play your level!')
  alert('[' + usercreatedseed + '],[' + movingArray + ']' )
  let seedbox = document.getElementById('seedbox')
  seedbox.innerHTML = '[' + usercreatedseed + '],[' + movingArray + ']'
}


function playCustomLevel() {
  var mycustomseed = prompt('Enter the custom seed of the level (format: [manynumbers],[otherstuff])');
  //remove all spaces
  mycustomseed = mycustomseed.replace(/\s/g, "");
//split seed into 2 parts
  var delimiterIndex = mycustomseed.indexOf(",");
  //if comma is in a valid index
  if (delimiterIndex !== -1) {
    //slice at the index of the comma
    var firstpartseed = mycustomseed.slice(1, delimiterIndex).trim();
    //slice again but for the second half
    var movingdivsettings = mycustomseed.slice(delimiterIndex + 1, -1).trim();
    //remove square brackets
    movingdivsettings = movingdivsettings.replace(/\[|\]/g, "");
  } else {
    //if comma is not there, return error
    console.log('Invalid string format');
    return;
  }

  seedsArray = [firstpartseed, '0'];
movingBlockSettings = [movingdivsettings.split(",")];  console.log(movingBlockSettings)
  var countsfdg = firstpartseed.split("2").length - 1;
  coinsPerLevel = [countsfdg]
  console.log(movingdivsettings)
  console.log('cpl is ' + coinsPerLevel)
  startEverything();
}