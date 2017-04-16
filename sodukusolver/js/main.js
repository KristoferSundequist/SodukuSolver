/*global document,image, Image, int, alert*/

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
/////////////////////////////////            GLOBALS           ////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var group0 = [0,1,2,9,10,11,18,19,20];
var group1 = [3,4,5,12,13,14,21,22,23];
var group2 = [6,7,8,15,16,17,24,25,26];
var group3 = [27,28,29,36,37,38,45,46,47];
var group4 = [30,31,32,39,40,41,48,49,50];
var group5 = [33,34,35,42,43,44,51,52,53];
var group6 = [54,55,56,63,64,65,72,73,74];
var group7 = [57,58,59,66,67,68,75,76,77];
var group8 = [60,61,62,69,70,71,78,79,80];

//intersection([1,2,3,4], [2,3,6,7]) == [2,3]
function intersection(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    });
}


Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

//only works on sorted
//complement([1,2,3,4,5], [1,2,3,4,5,6,7,8,9]) == [6,7,8,9]
function complement(a,b){
	return a.diff(b);
}

function member(v, arr){
	for(var i = 0; i < arr.length; i++){
		if(v == arr[i]){
			return true;
		}
	}
	return false;
}

//Enum to hold tile-states
var State = {
	Hidden: 0,
	Shown: 1,
};

//Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var canvasSize = 495;
canvas.width = canvasSize;
canvas.height = canvasSize;
document.body.appendChild(canvas);

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
/////////////////////////////////          HELP CODE           ////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//Checks if an array contains a value
function Contains(a, obj) {
	var i = a.length;
	while (i--) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}

//Clears canvas
function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
/////////////////////////////////        INFRASTRUCTURE        ////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//Tile
function Tile(number, tileState) {
	this.number = number;
	this.tileState = tileState; //State of tile ( Hidden / Shown )
	this.possibleValues = [1,2,3,4,5,6,7,8,9];
	
	this.removePossibleValue = function(n){
		for(var i = 0; i < this.possibleValues.length; i++){
			if(this.possibleValues[i] == n){
				this.possibleValues.splice(i,1);
				return;
			}
		}
	}
	
	this.returnNumber = function(){
		return this.number;
	};
	
	this.hide = function(){
		this.tileState = State.Hidden;
	};
	this.show = function(){
		this.tileState = State.Shown;
	};
	this.set = function(n){
		this.number = n;
	};
	this.reset = function(){
		this.set(0);
		this.hide();
		this.possibleValues = [1,2,3,4,5,6,7,8,9];
	};
}

//Board
function Board(){
	var Tiles = [];
	var tilesPerRow = 9;
	
	var tileSize = canvasSize/tilesPerRow;
	var numberOfTiles = tilesPerRow*tilesPerRow;
	
	//Skapar tiles och sparar dem i Tiles[]
	this.generateBoard = function(){
		Tiles.length = 0;
		
		//Skapar tiles samt minor och sparar dem i Tiles[]
		for(var i = 0; i < numberOfTiles; i++){
			var newTile = new Tile(0, State.Hidden);
			Tiles.push(newTile);
		}
		
		this.drawBoard();
	};
	
	//Ritar ut Tiles[] på en canvas
	this.drawBoard = function(){
		var row = 0;
		var col = 0;
		
		clearCanvas();
		
		for(var i = 1; i <= numberOfTiles; i++){
			//alert(Tiles[i-1].returnAdjoiningMines() + " " + Tiles[i-1].isMine);
			
			//Formen
			ctx.beginPath();
			ctx.rect(tileSize*col, tileSize*row, tileSize-3, tileSize-3);
			
			//Border
			ctx.strokeStyle = "black";
			ctx.stroke();
			
			if(Tiles[i-1].tileState == State.Hidden){ //Hidden
				ctx.font = "30pt Helvetica";
				ctx.fillStyle = "blue";
				ctx.fillText("~", tileSize*col+4, tileSize*row+(tileSize)-4);
			}else{
				ctx.fillStyle = "black";
				ctx.font = "19pt Helvetica";
				ctx.fillText(Tiles[i-1].returnNumber(), tileSize*col+8, tileSize*row+(tileSize)-8);
			}
			
			col++;
			if(i % tilesPerRow === 0 && i !== 0){
				row++;
				col = 0;
			}
		}
	};
	
	
	this.getTileId = function(x, y){
		return (Math.floor(y/tileSize) * tilesPerRow) + Math.floor(x/tileSize);
	}

	this.playerInput = function(key, tileId){
		
		//Tar ut vilken tileID baserat på x,y på musklicket
		//var tileId = this.getTileId(x,y);
		//console.log("pInput " + key + " " + tileId);
		//console.log(this.getGroup(tileId));
		//Om vänsterklick
		if(key === 0){
			Tiles[tileId].reset();
		//error
		}else if(key === 2){
			alert("PossibleValues: " + Tiles[tileId].possibleValues);
			//alert("groyp " + this.getGroup(tileId));
			//alert("rowwithingroup: " + this.getRowWithinGroup(tileId) + " row: " + this.getRow(tileId) + " group: " + this.getGroup(tileId));
			//alert("groyp " + this.getGroup(tileId));
			//alert("groupwithoutRow: " + complement(this.getGroup(tileId), this.getRowWithinGroup(tileId)));
		}else if(key === 49){
			Tiles[tileId].show();
			Tiles[tileId].set(1);
			Tiles[tileId].possibleValues = [];
		}else if(key === 50){
			Tiles[tileId].show();
			Tiles[tileId].set(2);
			Tiles[tileId].possibleValues = [];
		}else if(key === 51){
			Tiles[tileId].show();
			Tiles[tileId].set(3);
			Tiles[tileId].possibleValues = [];
		}else if(key === 52){
			Tiles[tileId].show();
			Tiles[tileId].set(4);
			Tiles[tileId].possibleValues = [];
		}else if(key === 53){
			Tiles[tileId].show();
			Tiles[tileId].set(5);
			Tiles[tileId].possibleValues = [];
		}else if(key === 54){
			Tiles[tileId].show();
			Tiles[tileId].set(6);
			Tiles[tileId].possibleValues = [];
		}else if(key === 55){
			Tiles[tileId].show();
			Tiles[tileId].set(7);
			Tiles[tileId].possibleValues = [];
		}else if(key === 56){
			Tiles[tileId].show();
			Tiles[tileId].set(8);
			Tiles[tileId].possibleValues = [];
		}else if(key === 57){
			Tiles[tileId].show();
			Tiles[tileId].set(9);
			Tiles[tileId].possibleValues = [];
		}else{
			alert("unknown key");
		}
		
		this.drawBoard();
	};
	
	
	//Game over method. Shows all mines and alerts "game over", then resets board
	this.gameOver = function(){
		alert("Game over!")
		this.generateBoard();
	};
	
	this.getRow = function(tileId){
		var arr = [];
		var startRow = tileId - (tileId%9);
		var endRow = startRow + 8;
		for(var i = startRow; i <= endRow; i++){
			arr.push(i);
		}
		return arr;
	};
	
	this.getColumn = function(tileId){
		var arr = [];
		var startColumn = tileId%9;
		var endColumn = (tileId%9) + 9*8;
		for(var i = startColumn; i <= endColumn; i = i+9){
			arr.push(i);
		}
		return arr;
	};
	
	this.getGroup = function(tileId){
		if(member(tileId, group0)){
			return group0;
		}
		else if(member(tileId, group1)){
			return group1;
		}
		else if(member(tileId, group2)){
			return group2;
		}
		else if(member(tileId, group3)){
			return group3;
		}
		else if(member(tileId, group4)){
			return group4;
		}
		else if(member(tileId, group5)){
			return group5;
		}
		else if(member(tileId, group6)){
			return group6;
		}
		else if(member(tileId, group7)){
			return group7;
		}
		else {
			return group8;
		}
	};
	
	this.getRowWithinGroup = function(tileId){
		var g = this.getGroup(tileId);
		var r = this.getRow(tileId);
		var i = intersection(g,r);
		return i;
	}
	
	this.getColWithinGroup = function(tileId){
		var group = this.getGroup(tileId);
		var col = this.getColumn(tileId);
		
		return intersection(group, col);
	}
	
	this.bot = function(){
		//loop through all tiles and remove possible values
		for(var i = 0; i < numberOfTiles; i++){
			//Only check unknown tiles
			if(Tiles[i].tileState == State.Hidden){
				var row = this.getRow(i);
				var col = this.getColumn(i);
				var group = this.getGroup(i);
				
				//var rowValues = [];
				//var colValues = [];
				//var groupValues = [];
				
				//removes possiblevalues of found on same row.
				for(var j = 0; j < row.length; j++){
					if(Tiles[row[j]].tileState == State.Shown){
						if(member(Tiles[row[j]].returnNumber(),Tiles[i].possibleValues)){
							Tiles[i].removePossibleValue(Tiles[row[j]].returnNumber());
						}
					}
				}
				
				//remove possiblevalues of found on same column
				for(var j = 0; j < col.length; j++){
					if(Tiles[col[j]].tileState == State.Shown){
						if(member(Tiles[col[j]].returnNumber(),Tiles[i].possibleValues)){
							Tiles[i].removePossibleValue(Tiles[col[j]].returnNumber());
						}
					}
				}
				
				//remove possiblevalues of found in same group
				for(var j = 0; j < group.length; j++){
					if(Tiles[group[j]].tileState == State.Shown){
						if(member(Tiles[group[j]].returnNumber(),Tiles[i].possibleValues)){
							Tiles[i].removePossibleValue(Tiles[group[j]].returnNumber());
						}
					}
				}
				
				
				
				//If only one possible value is left, then we know thats the real value
				if(Tiles[i].possibleValues.length == 1){
					this.playerInput(Tiles[i].possibleValues[0]+48, i);
					return;
				}
				
			}
		}
		
		
		//loop through all tiles
		for(var i = 0; i < numberOfTiles; i++){
			//Only check unknown tiles
			if(Tiles[i].tileState == State.Hidden){
				var row = this.getRow(i);
				var col = this.getColumn(i);
				var group = this.getGroup(i);
		
				//loop through all possible values of Tiles[i] and check if tiles[i] is alone in a value within row/col/group
				for(var j = 0; j < Tiles[i].possibleValues.length; j++){
					//current possible value = Tiles[i].possibleValues[j]
					//Loop through row
					
					for(var z = 0; z <= 8; z++){
						//if found in row
						//alert(Tiles[row[z]].possibleValues);
						
						if(i !== row[z] && member(Tiles[i].possibleValues[j], Tiles[row[z]].possibleValues)){
							break;
						}
						if(z==8){
							this.playerInput(Tiles[i].possibleValues[j]+48, i);
							return;
						}
					}
					
					//Loop through column
					for(var z = 0; z <= 8; z++){
						//if found in col
						if(i !== col[z] && member(Tiles[i].possibleValues[j], Tiles[col[z]].possibleValues)){
							break;
						}
						if(z==8){
							this.playerInput(Tiles[i].possibleValues[j]+48, i);
							return;
						}
					}
					
					//Loop through group
					for(var z = 0; z <= 8; z++){
						//if found in group
						if(i !== group[z] && member(Tiles[i].possibleValues[j], Tiles[group[z]].possibleValues)){
							break;
						}
						if(z==8){
							this.playerInput(Tiles[i].possibleValues[j]+48, i);
							return;
						}
					}
				}
				
				
			}
		}
		alert("Bot to dumb");
	};
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
/////////////////////////////////         MAIN PROGRAM         ////////////////////////////////////
/////////////////////////////////                              ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var game = new Board();
game.generateBoard();

//mouse tracker
var mX = 0;
var mY = 0;

addEventListener("mousemove", function(e){
	mX = e.clientX;
	mY = e.clientY;
});
///////////

////// MOUSE DOWN EVENT
canvas.onmousedown = function (e) {
	//console.log(e);
	
	game.playerInput(e.button, game.getTileId(e.clientX, e.clientY));
	//alert(e.button + " " + e.x + " " + e.y);
};

//Events som lyssnar efter knapptryckn
addEventListener("keydown", function (e) {
	//space down
	console.log(e);
	if(e.which == 32){
		game.bot();
	}else{
		game.playerInput(e.keyCode, game.getTileId(mX, mY));
	}
}, false);

