//GRID CONSTRUCTOR
var Grid = function(grid_size) {
	this.grid = [];
	this.size = grid_size;
	this.clear();
}
Grid.prototype = {
	constructor: Grid,
	length: function() {
		return this.size;
	},
	clear: function() {
		this.grid = [];
		for (i = 0; i < this.size; i++) {
			var row = [];
			for (j = 0; j < this.size; j++) {
				row.push(0);
			}
			this.grid.push(row);
		}
	},
	isEmpty: function(row, col) {
		return !this.grid[row][col];
	},
	to_coord: function(index) {
		return [Math.floor(index / this.size), (index % this.size)];
	}/*,
	SAVING TO USE IN MINESWEEPER PROJECT
	eightNeighbors: function(row, col) {
        var result = [];

        (row > 0) ? result.push([row - 1, col]) : ;
        (col > 0) ? result.push([row, col - 1]) : ;
        (row < this.size - 1) ? result.push([row + 1, col]) : ;
        (col > this.size - 1) ? result.push([row, col + 1]) : ;
		(row > 0 && col > 0) ? result.push([row - 1, col - 1]) 
		(row > 0 && col < this.size - 1) ? result.push([row - 1, col + 1]) : ;
		(row < this.size - 1 && col > 0) ? result.push([row + 1, col - 1]) : ;
		(row < this.size - 1 && col < this.size - 1) ? result.push([row + 1, col + 1]); 

        return result;
	}*/
}

//TIC-TAC-TOE DATA MODULE
var ticTacToe = (function($, undefined) {
	var grid = new Grid(3);
	var current_player = 1;
	var round = 0;
	var score = [0,0];

	var addMove = function(cell_index) {
		var cell = grid.to_coord(cell_index);
		if (grid.isEmpty(cell[0], cell[1])) {
			grid.grid[cell[0]][cell[1]] = current_player;
			return true;
		} else {
			return false;
		}
	};

	var didWin = function(val) {
		var g = grid.grid;

		var crossDown = (val == g[1][1] && val == g[0][0] && val == g[2][2]);
		var crossUp = (val == g[1][1] && val == g[2][0] && val == g[0][2]);
		
		if ( crossDown || crossUp ) {
			return true;
		}

		for (i = 0; i < grid.length(); i = i + 1) {
			var horizontal = (val == g[i][0] && val == g[i][1] && val == g[i][2]);
			var vertical = (val == g[0][i] && val == g[1][i] && val == g[2][i]);
			
			if ( horizontal || vertical ) {
				return true;
			}
		}
		return false;
	}
	var clear = function() {
		grid.clear();
		round = 0;
		current_player == 1 ? current_player = 2 : current_player = 1;
	};
	var updateGame = function() {
		if (didWin(current_player) || round >= 8) {
			if (didWin(current_player)) {
				current_player == 1 ? score[1] += 1 : score[0] += 1;
			}
			clear();
			return true;
		} else {
			round += 1;
			current_player == 1 ? current_player = 2 : current_player = 1;
			return false;
		}
	};

	return {
		gridSize: function() { return grid.length(); },
		player: function() { return (current_player == 1) ? 'x' : 'o'; },
		score: function() { return score; },
		gameOver: updateGame,
		addMove: addMove,
	}
})(jQuery);

$( document ).ready(function() {
	(function(window, $, game, undefined) {
		var createBoard = function() {
			var container = $("#main");
			var boardarea = $("<div id='tic-tac-toe'></div>");
			for (var i = 0; i < (game.gridSize() * game.gridSize()); i = i + 1) {
				boardarea.append( "<div class='cell'></div>" );
			}	
			container.append(boardarea);
			return container;
		}
		var updateScore = function() {
			var score = game.score();
			$("#o-score").text('Y: ' + score[0]);
			$("#x-score").text('X: ' + score[1]);
		}
		var board = createBoard();
		var cells = $(".cell");
		var waiting = false;

		board.on('click', 'div', function( event ) {

			event.stopPropagation();
			if ($( this ).hasClass("cell") && !waiting) {
				
				if (game.addMove($( this ).index())) {
					$( this ).addClass(game.player());
					
					if (game.gameOver()) {
						updateScore();
						waiting = true;
						$("#game-over h2").fadeIn(800).delay(1000).fadeOut(1000, function() {
								cells.removeClass('x').removeClass('o');
								waiting = false;
						});
					}
				}
			}
		});

	})(window, jQuery, ticTacToe);
});
				
 