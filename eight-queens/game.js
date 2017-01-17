'use strict';
(function globalOne() {

    var maxRow = 8;
    var maxCol = 8;
    var currentColumn = 0;
    var currentRow = 0;

    var interval;
    createGrid(maxRow, maxCol);
    setCurrentNode(getRootNode());
    var startButton = document.getElementById('startButton');
    var resetButton = document.getElementById('resetButton');
    var stepButton = document.getElementById('stepButton');
    var stopButton = document.getElementById('stopButton');
    var removeThreatsButton = document.getElementById('removeThreatButton');
    startButton.onclick = function () {
        interval = setInterval(function () {
            exploreNextChildState(getCurrentNode());
        }, 500);
    };


    resetButton.onclick = function () {
        setCurrentNode(getRootNode());
        createGrid();
    };
    stepButton.onclick = function () {
        exploreNextChildState(getCurrentNode());
    };
    stopButton.onclick = function () {
        clearInterval(interval)
    };
    removeThreatsButton.onclick = function () {
        var parentNode = getCurrentNode().parent;
        clearThreats(parentNode.position.row, parentNode.position.column);
    };

    /**
     * returns the First Ever Node
     * @returns {{position: {row: number, column: number}, children: *, explored: Array, threats: number, rootNode: boolean, stated: boolean}}
     */
    function getRootNode() {
        return {
            position: {row: -1, column: -1},
            children: getAllAvailablePlacesInNextColumn({position: {row: -1, column: -1}}),
            explored: [],
            threats: 0,
            rootNode: true,
            stated: false
        };

    }

    function setCurrentNode(node) {
        window.queens = window.queens || {};
        window.queens.currentNode = node;
    }

    function getCurrentNode() {
        return window.queens.currentNode;
    }

    /**
     * Creates the Grid
     * @param Row {Number} 
     * @param Col {Number}
     */
    function createGrid(Row, Col) {
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

        for (var i = 0; i < rowVal; i++) {

            var row = document.createElement('div');
            row.className = 'grid-row';
            row.id = 'row-' + i;
            row.style.height = cellHeight + '%';
            grid.appendChild(row);
            for (var j = 0; j < colVal; j++) {
                var cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = cellWidth.toString() + '%';
                cell.style.height = '100%';
                cell.id = 'r' + i + '-c' + j;
                if (i % 2 == 0 && j % 2 == 0) {
                    cell.classList.add('alive');
                } else if (i % 2 != 0 && j % 2 != 0) {
                    cell.classList.add('alive');
                }
                cell.onclick = function () {
                    this.classList.toggle('alive')
                };
                row.appendChild(cell);
            }

        }
    }

    /**
     * This is the exploratory function which places queen at current Position and explores next Child, also backtracks to the parent
     * if there are no possible children
     * @param node
     */
    function exploreNextChildState(node) {
        if (goalAchieved(node)) {
            displayVictoryMessage();
            clearInterval(interval);
        } else {
            if (node.rootNode && !node.started) {
                node.started = true;
                //placeQueen(node.position.row, node.position.column);

                node.children = getAllAvailablePlacesInNextColumn(node);
                if (node.children.length > 0) {
                    //Means there are places available
                    var nextChild = node.children[0];
                    node.explored.push(nextChild);
                    setCurrentNode(nextChild);
                    //exploreNextChildState(nextChild);
                } else {
                    //explore next state of parent
                    // Clear squares for current position
                    clearThreats(node.position.row, node.position.column);
                    exploreNextChildState(node.parent);
                }

            } else if (node.rootNode && node.started) {
                // Came back to rooot
                document.getElementById('messages').innerHTML = 'Could Not Achieve the State !!';
            } else {

                placeQueen(node.position.row, node.position.column);
                if (node.founcChildren) {
                    // Dont Find Children Anymore, just take next from explred

                } else {
                    node.children = getAllAvailablePlacesInNextColumn(node);
                    node.founcChildren = true;
                }


                if (node.children.length > 0) {
                    //Means there are places available
                    //var currentChild = node.children[node.explored.length];//node.children[0];

                    var exploredChild = node.children[0];
                    node.children = node.children.slice(1, node.children.length);
                    node.explored.push(exploredChild);
                    setCurrentNode(exploredChild);
                    //exploreNextChildState(nextChild);
                } else {
                    //explore next state of parent
                    // Clear squares for current position
                    clearThreats(node.position.row, node.position.column);
                    removeQueenImage(node);
                    exploreNextChildState(node.parent);
                }
            }
        }


    }

    /**
     * This is the goal function keeps on checking if goal has been achieved
     * @param node
     * @returns {boolean}
     */
    function goalAchieved(node) {
        return node.position.column > maxCol - 1
    }

    function removeQueenImage(node) {
        var cell = document.getElementById(constructCellId(node.position.row, node.position.column));
        while (cell.lastChild) {
            cell.removeChild(cell.lastChild);
        }
    }

    function clearThreats(row, column) {
        paintThreats(row, column, true);
    }


    function getAllAvailablePlacesInNextColumn(node) {
        var children = [];
        var nextColumn = node.position.column + 1;
        for (var i = 0; i < maxRow; i++) {
            if (isPlaceValid(i, nextColumn)) {
                //children.push([i, nextColumn]);
                var child = {
                    position: {row: i, column: nextColumn},
                    children: [],
                    explored: [],
                    parent: node,
                    threats: 0
                };

                children.push(child);
            } else {
                //console.log('not valid place ')
            }
        }

        return children;
    }

    function displayVictoryMessage() {
        var messageDiv = document.getElementById('messages');
        var messageString = 'Yay !! Found the solution';
        var message = document.createElement('div');
        message.innerHTML = messageString;
        messageDiv.appendChild(message);
    }
    
    function placeQueen(Row, Column) {
        var row = Row || 0;
        var column = Column || 0;
        if (!isPlaceValid(row, column)) {
            console.log('Place is invalid : row ' + Row + ', column : ' + Column);
        } else {
            placeQueenImage(row, column);
            paintThreats(row, column);
        }


    }

    /**
     * This function checks whether cell has anjy children. Cell will have only following children
     * <ul>
     *     <li> Queen Image </li>
     *     <li> Threat Image</li>
     * </ul>
     * @param row
     * @param column
     * @returns {boolean}
     */
    function isPlaceValid(row, column) {
        var ele = document.getElementById(constructCellId(row, column));
        return !(ele && ele.children && ele.children.length > 0);
    }

    
    function placeQueenImage(Row, Column) {
        var row = Row || currentRow;
        var column = Column || currentColumn;
        var cell = document.getElementById(constructCellId(row, column));
        var img = document.createElement('img');
        img.src = 'Queen.png';
        img.classList.add('imageClass');
        img.classList.add('queen');
        cell.appendChild(img);
    }

    function paintThreats(Row, Column, remove) {
        paintRowThreats(Row, remove);
        paintColumnThreats(Column, remove);
        paintCrossThreats(Row, Column, remove);
    }

    function paintCrossThreats(Row, Column, remove) {
        paintIterator(Row, Column, {row:1, column:1}, remove);
        paintIterator(Row, Column, {row:1, column:0}, remove);
        paintIterator(Row, Column, {row:0, column:1}, remove);
        paintIterator(Row, Column, {row:0, column:0}, remove);

    }

    function paintIterator(row, column, position, remove){
        var rowOperation = position.row == 1 ? increase : decrease;
        var columnOperation = position.column == 1 ? increase : decrease;
        while (row < maxRow && row >= 0 && column >= 0 && column < maxCol) {
            var ele = document.getElementById(constructCellId(row, column));
            if (remove) {
                removeThreatImage(ele);
            } else {
                placeThreatImage(ele);
            }

            row = rowOperation(row);
            column = columnOperation(column);
        }
    }

    function increase(num){
        return num+1;
    }

    function decrease(num){
        return num-1;
    }

    function paintColumnThreats(Column, remove) {
        for (var i = 0; i < maxRow; i++) {
            var ele = document.getElementById(constructCellId(i, Column));
            if (remove) {
                removeThreatImage(ele);
            } else {
                placeThreatImage(ele);
            }
        }
    }

    function paintRowThreats(Row, remove) {
        for (var i = 0; i < maxCol; i++) {
            var ele = document.getElementById(constructCellId(Row, i));
            if (remove) {
                removeThreatImage(ele);
            } else {
                placeThreatImage(ele);
            }

        }
    }

    function removeThreatImage(ele) {
        
        if (ele.children && ele.children.length && ele.children.length > 0) {
            if (ele.children.length > 1) {
                for (var j = 0; j < ele.children.length; j++) {
                    if (ele.children[j].classList.contains('hideThreat')) {
                        ele.removeChild(ele.children[j]);
                        return;
                    }
                }
            } else if (ele.children.length == 1) {
                if (ele.children[0].classList.contains('imageClass')) {
                    ele.removeChild(ele.children[0]);
                }
            }
        }
    }

    function placeThreatImage(cellElement) {
        var img = document.createElement('img');
        img.className = 'imageClass';
        img.src = 'threat.png';
        
        if (cellElement.children.length > 0) {
            // Means either has queen or has the threat
            // Just include one more threat to the cell
            img.classList.add('hideThreat');
            cellElement.appendChild(img);
        } else {
            cellElement.appendChild(img);
        }
    }


    function constructCellId(row, column) {
        return 'r' + row.toString() + '-' + 'c' + column.toString();
    }

}());

