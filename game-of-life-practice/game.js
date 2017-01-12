(function globalOne(){

	var maxRow = 20;
	var maxCol = 20;
	var interval;
	createGrid(maxRow, maxCol);
    var startButton = document.getElementById('startButton');
    var resetButton = document.getElementById('resetButton');
    var stepButton = document.getElementById('stepButton');
    var stopButton = document.getElementById('stopButton');
    var clearButton = document.getElementById('clearButton');
    startButton.onclick = function(){ interval = setInterval(function() { nextStep(); }, 300);};	
    resetButton.onclick = function(){clearInterval(interval); createGrid();}
    stepButton.onclick = function(){nextStep();}
    stopButton.onclick = function(){clearInterval(interval)};
	clearButton.onclick = function(){clearInterval(interval);clearGrid()}
    function clearGrid(){
    	var allCells = document.getElementsByClassName('cell');
    	for(var i=0;i<allCells.length;i++){
    		allCells[i].classList.remove('alive');
    	}
    }

	function createGrid(Row, Col){
		var rowVal = Row || 20;
		var colVal = Col || 20;

		// Get the El
		var grid = document.getElementById('grid');

		
		var cellWidth = 1 / colVal * 100;
		console.log("cellWidth: " + String(cellWidth));

		var cellHeight = 1 / rowVal * 100;
		console.log("cellHeight: " + String(cellHeight));

	    // Clear grid completely
	    while (grid.lastChild) {
	    	grid.removeChild(grid.lastChild);
	    } 

	    for(var i=0;i<rowVal;i++){

	    	var row = document.createElement('div');
	    	row.className = 'grid-row';
	    	row.id = 'row-' + i;
	    	row.style.height = cellHeight + '%';
	    	grid.appendChild(row);
	    	for(var j=0;j<colVal;j++){
	    		var cell = document.createElement('div');
	    		cell.className = 'cell';
	    		cell.style.width = cellWidth.toString() + '%';
	    		cell.style.height = '100%';
	    		cell.id = 'r' + i + '-c' + j;
	    		if(i%2==0 && j%2==0){
	    			cell.classList.add('alive');
	    		}else if(i%2!=0 && j%2!=0){
	    			cell.classList.add('alive');
	    		}
	    		cell.onclick = function(){this.classList.toggle('alive')}
	    		//cell.innerHTML = 'a';

	    		row.appendChild(cell);

	    	} 

	    }
	}


	/*
	Steps Here 
	1. Once Started 
		Loop through all the cells to find if in next step
		cell is gonna die or is gonna become alive again

		to check that 
			a. Get all neighbors 
			b. Analyze their current State 
				aa. if there are more than 3 neighbors who 
				are alive now - return die
				bb. if there are lesser than 2 neighbors who 
				are alive now --  return die
				if they are in between --> remain alive or reborn 

			make sure you are seeing the cells within the grid

	
	*/

	// Just Evolves for the next step

	function nextStep(){
		var allCells = document.getElementsByClassName('cell');
		
		// Trap Here !! First Collect all the statuses and then in next loop update them;
		// First Collect all new statuses
		var newStatuses = {};
		for(var n=0;n<allCells.length;n++){
			newStatuses[allCells[n].id] = willLive(allCells[n].id);
		}


		for(var i=0;i<allCells.length;i++){
			
			allCells[i].classList.toggle('alive', newStatuses[allCells[i].id]);
		}

	}

	function willLive(cellId){
		var neighbors = getAllNeighbors(cellId);		
		var alive = document.getElementById(cellId).classList.contains('alive');
		var cellAlliveNeighbors = getAliveNeighbors(neighbors); 
		if(alive){

			if(cellAlliveNeighbors < 2 || cellAlliveNeighbors > 3){
				alive =  false;
			}else{
				//alive = false;
			}

		}else{

			if(cellAlliveNeighbors == 3){
				alive =  true;
			}else{
				//alive = false;
			}

		}
		

		

		return alive;
	}

	function getAliveNeighbors(neighbors){
		var alliveNeighbors = 0;
		neighbors.forEach(function(neighborDudeId){
			var dead = isDead(neighborDudeId);
			if(!dead){
				//Count the Neighbors
				alliveNeighbors++;
			}else{
				
			}
		});
		return alliveNeighbors;
	}

	function getAllNeighbors(cellId){
		//find all the eight neighbors here
		var neighbors = [];
		var eightConditions = [[-1,1], [0,1],[1,1],[-1, 0], [1,0], [-1,-1],[0,-1],[1,-1]];
		var parsedCellId = parseEleId(cellId);
		eightConditions.forEach(function(cond){
			var rowNumber = parsedCellId[0] + cond[0];
			var colNumber = parsedCellId[1] + cond[1];
			if((rowNumber < 0 || rowNumber>=maxRow) || (colNumber < 0 || colNumber >=maxCol)){
					// means cell is oout of the grid
			}else{
				neighbors.push(constructCellId(rowNumber, colNumber));
			}
		});

		return neighbors;

	}

	function parseEleId(cellId){
		var spliOne = cellId.split('-');
		var rowNum = parseInt(spliOne[0].slice(1));
		var colNum = parseInt(spliOne[1].slice(1));

		return [rowNum, colNum];
	}

	function constructCellId(rowNum, colNum){
		return 'r'+rowNum.toString() + '-' + 'c' + colNum.toString();
	}


	function isDead(cellId){
			//console.log(cellId);
			return !document.getElementById(cellId).classList.contains('alive');
	}

	function getCell(cellId){
		return document.getElementById(cellId);
	}

}())

