(function globalOne(){

	var maxRow = 8;
	var maxCol = 8;
	var currentColumn = 0;
	var currentRow = 0;
	var currentNode;

	var interval;
	createGrid(maxRow, maxCol);
	//setRootNode();
	setCurrentNode(getRootNode());
	var startButton = document.getElementById('startButton');
	var resetButton = document.getElementById('resetButton');
	var stepButton = document.getElementById('stepButton');
	var stopButton = document.getElementById('stopButton');
	var removeThreatsButton = document.getElementById('removeThreatButton');
	startButton.onclick = function(){ 
		interval = setInterval(function() { exploreNextChildState(getCurrentNode()); }, 500);


	};	


	resetButton.onclick = function(){setCurrentNode(getRootNode()); createGrid();}
	stepButton.onclick = function(){exploreNextChildState(getCurrentNode());}
	stopButton.onclick = function(){clearInterval(interval)};
	removeThreatsButton.onclick = function(){
		var parentNode = getCurrentNode().parent;
		clearThreats(parentNode.position.row, parentNode.position.column);
	}

	function getRootNode(){
		var node = {
			position : {row: -1, column : -1},
			children : getAllAvailablePlacesInNextColumn({position :{row : -1, column : -1}}),
			explored : [],
			threats : 0,
			rootNode : true,
			stated : false
		}

		//currentNode = node;
		console.log(node);
		return node;
	}

	function setCurrentNode(node){
		window.queens = window.queens || {};
		window.queens.currentNode = node;
	}	

	function getCurrentNode(){
		return window.queens.currentNode;
	}




	var sampleNode = {
		position :{
			row : 0,
			column : 0
		},
		children : [],
		explored : []
	}

	function createGrid(Row, Col){
		var rowVal = Row || 8;
		var colVal = Col || 8;

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

	

	function exploreNextChildState(node){
		if(goalAchieved(node)){	
			displayVictoryMessage();
			clearInterval(interval);
		}else{
			if(node.rootNode && !node.started){
			node.started = true;
			//placeQueen(node.position.row, node.position.column);

			node.children = getAllAvailablePlacesInNextColumn(node);
			if(node.children.length>0){
				//Means there are places available
				var nextChild = node.children[0];
				node.explored.push(nextChild);
				setCurrentNode(nextChild);
				//exploreNextChildState(nextChild);
			}else{
				//explore next state of parent
				// Clear squares for current position
				clearThreats(node.position.row, node.position.column);
				exploreNextChildState(node.parent);
			}

		}else if(node.rootNode && node.started){
			// Came back to rooot
			document.getElementById('messages').innerHTML = 'Could Not Achieve the State !!';
		}else{
			
			placeQueen(node.position.row, node.position.column);
			if(node.founcChildren){
				// Dont Find Children Anymore, just take next from explred
			
			}else{
				node.children = getAllAvailablePlacesInNextColumn(node);
				node.founcChildren = true;
			}
			
			
			if(node.children.length>0){
				//Means there are places available
				//var currentChild = node.children[node.explored.length];//node.children[0];

				var exploredChild = node.children[0];
				var remainingChildren = node.children.slice(1, node.children.length);
				node.children = remainingChildren;
				node.explored.push(exploredChild);
				var nextChild = node.children[0];
				setCurrentNode(exploredChild);
				//exploreNextChildState(nextChild);
			}else{
				//explore next state of parent
				// Clear squares for current position
				clearThreats(node.position.row, node.position.column);
				removeQueenImage(node);
				exploreNextChildState(node.parent);
			}
		}
		}
		
		
		


	}

	function goalAchieved(node){
		if(node.position.column > maxCol-1){
			return true;
		}

		return false;
	}

	function removeQueenImage(node){
		var cell = document.getElementById(constructCellId(node.position.row, node.position.column));
		while(cell.lastChild){
			cell.removeChild(cell.lastChild);
		}
	}

	function clearThreats(row, column){
		paintThreats(row, column, true);
	}

	 

	function getAllAvailablePlacesInNextColumn(node){
		var children = [];
		var nextColumn = node.position.column+1;
		for(var i=0;i<maxRow;i++){
			if(isPlaceValid(i, nextColumn)){
				//children.push([i, nextColumn]);
				var child = {
					position : {row : i, column : nextColumn},
					children : [],
					explored : [],
					parent : node,
					threats : 0
				}

				children.push(child);
			}else{
				console.log('not valid place ')
			}
		}

		return children;
	}

	function consoleMessage(row, column){
		/*var messageDiv = document.getElementById('messages');
		var messageString = 'Coudn\'t add queen at row ' + row + ' and column ' + column;
		var message = document.createElement('div');
		message.innerHTML = messageString;
		messageDiv.appendChild(message);*/
		console.log('Coudn\'t add queen at row ' + row + ' and column ' + column)
	}

	function displayVictoryMessage(){
		var messageDiv = document.getElementById('messages');
		var messageString = 'Yay !! Found the solution';
		var message = document.createElement('div');
		message.innerHTML = messageString;
		messageDiv.appendChild(message);
	}

	function nextStep(node){
		/**
			Loop through Current Column, find the first place which is valid
			Place a queen there, create the threats and Increase the column count
		*/
		var currentColumn = node.position.column
		if(currentColumn < maxCol){
			var findRow = 0;
			for(var i=0; i<maxRow;i++){
				if(isPlaceValid(i, currentColumn)){
					findRow = i;
					break;
				}
			}

			placeQueen(findRow, currentColumn);
			currentColumn ++
		}
		
	}

	function placeQueen(Row, Column){
		var row = Row || 0;
		var column = Column || 0;
		if(!isPlaceValid(row, column)){
			consoleMessage(row, column);
		}else{
			placeQueenImage(row, column);
			paintThreats(row, column);
		}

		
	}

	function isPlaceValid(row, column){
		var ele = document.getElementById(constructCellId(row, column));
		if(ele && ele.children && ele.children.length>0){
			// Means has some children --> not valid
			return false;
		}

		return true;
	}


	function placeQueenImage(Row, Column){
		var row = Row || currentRow;
		var column = Column || currentColumn;
		var cell = document.getElementById(constructCellId(row, column));
		var img = document.createElement('img');
		img.src = 'Queen.png';
		img.classList.add('imageClass');
		img.classList.add('queen');
		cell.appendChild(img);
		//nextColumn();
	}

	function paintThreats(Row, Column, remove){
		paintRowThreats(Row, remove);
		paintColumnThreats(Column, remove);
		paintCrossThreats(Row, Column, remove);
	}

	function paintCrossThreats(Row, Column, remove){

		//var four;
		paintRightDown(Row, Column, remove);
		paintRightUp(Row, Column, remove);
		paintLeftDown(Row, Column, remove);
		paintLeftUp(Row, Column, remove);

	}

	function paintRightDown(row, column, remove){

		while(row<maxRow && row>=0 && column>=0 && column <maxCol){
			var ele  = document.getElementById(constructCellId(row, column));
			if(remove){
				removeThreatImage(ele);
			}else{
				palceThreatImage(ele);
			}
			row++; column++;	
		}
	}

	function paintRightUp(row, column,remove){
		while(row<maxRow && row>=0 && column>=0 && column <maxCol){
			var ele  = document.getElementById(constructCellId(row, column));
			if(remove){
				removeThreatImage(ele);
			}else{
				palceThreatImage(ele);
			}
			row++; column--;	
		}
	}

	function paintLeftUp(row, column, remove){
		while(row<maxRow && row>=0 && column>=0 && column <maxCol){
			var ele  = document.getElementById(constructCellId(row, column));
			if(remove){
				removeThreatImage(ele);
			}else{
				palceThreatImage(ele);
			}
			row--; column--;	
		}
	}

	function paintLeftDown(row, column, remove){
		while(row<maxRow && row>=0 && column>=0 && column <maxCol){
			var ele  = document.getElementById(constructCellId(row, column));
			if(remove){
				removeThreatImage(ele);
			}else{
				palceThreatImage(ele);
			}
			row--; column++;	
		}
	}

	function paintColumnThreats(Column, remove){
		for(var i=0; i<maxRow;i++){
			var ele = document.getElementById(constructCellId(i, Column));
			if(remove){
				removeThreatImage(ele);
			}else{
				palceThreatImage(ele);
			}
		}	
	}

	function paintRowThreats(Row, remove){

		for(var i=0; i<maxCol;i++){
			var ele = document.getElementById(constructCellId(Row, i));
			if(remove){
				removeThreatImage(ele);
			}else{
				palceThreatImage(ele);
			}
			
		}
	}

	function removeThreatImage(ele){
		//var ele = document.getElementById(constructCellId(row, column));
		//var threats = getCurrentNodeThreats();
		if(ele.children && ele.children.length && ele.children.length>0){
			if(ele.children.length>1){
				for(var j=0;j<ele.children.length;j++){
					if(ele.children[j].classList.contains('hideThreat')){
						ele.removeChild(ele.children[j]);
						return;
					}
				}
			}else if(ele.children.length ==1){
				if(ele.children[0].classList.contains('imageClass')){
					ele.removeChild(ele.children[0]);
				}
			}
		}

			 // Means he coudn't find any threats

			
		
	}

	function getCurrentNodeThreats(){
		return window.queens.currentNode.threats;
	}

	function palceThreatImage(cellElement){
		let img = document.createElement('img');
		img.className = 'imageClass';
		img.src = 'threat.png';
		/*console.log('here the cell')
		console.log(cellElement);*/
		/*if(cellElement.children.length==0){
			cellElement.appendChild(img);	
		}*/
		//console.log('outSide')
		/*for(var i=0; i<cellElement.children.length;i++){
			console.log(cellElement.children[i])
			if(cellElement.children[i].classList.contains('queen')){
				return;
			}
		}*/
		if(cellElement.children.length>0){
			// Means either has queen or has the threat
			// Just include one more threat to the cell
			img.classList.add('hideThreat');
			cellElement.appendChild(img);
			//addThreatToCurrentNode();
		}else{
			cellElement.appendChild(img);
		}	
	}

	function addThreatToCurrentNode(){
		/*var currentNode = window.queens.currentNode;
		var currentNode.threats++;
		window*/
		window.queens.currentNode.threats++;
		//console.log(window.queens.currentNode)
	}

	function removeThreatFromCurrentNode(){
		/*var currentNode = window.queens.currentNode;
		var currentNode.threats++;
		window*/
		window.queens.currentNode.threats--;
	}

	function nextRow(){
		if(currentRow<maxRow-1){
			currentRow++;	
		}else{
			currentRow =0;
		}
		
	}

	function nextColumn(){
		if(currentColumn<maxCol-1)	{
			currentColumn++;	
		}
		else {
			nextRow();
			currentColumn =0;
		}
	}



	function constructCellId(row, column){
		//console.log(row + ' and column ' + column);
		return 'r'+ row.toString() + '-' + 'c' + column.toString();
	}

	function getCell(cellId){
		return document.getElementById(cellId);
	}

}())

