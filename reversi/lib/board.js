let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = Array.from(Array(8), () => new Array(8));
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let x = pos[0];
  let y = pos[1];
  if (this.grid[x][y] === undefined) {
    return undefined;
  } 
  else if ((pos[0] < 0 || pos[0] > 7) || (pos[1] < 0 || pos[1] > 7)) {  
    throw "Not valid pos!";
  } 
  else {
    return this.grid[x][y];
  }
};


/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  let theGrid = this.grid;
  let oppColor = (color === "white" ? "black": "white");
  
  theGrid.forEach (function(row, rowIdx) {
    row.forEach (function(spot, spotIdx) {
      // console.log("hello");
      // console.log(Board.DIRS);
      Board.DIRS.forEach( function(dir) {
        let checkX = rowIdx + dir[0];
        let checkY = spotIdx + dir[1];
        while ((checkX >= 0 && checkX <= 7) && (checkY >= 0 && checkY <= 7)) {
          // ^ isValidPos
        
          if (theGrid[checkX][checkY] === undefined) {
            break;
          }
        
          if (theGrid[checkX][checkY].color === oppColor) {
            checkX += dir[0];
            checkY += dir[1];
            if (theGrid[checkX][checkY] === undefined) {
              return true;
            }
          }
        
          if (theGrid[checkX][checkY].color === color){
            break;
          }
        }
      });
    });
  });
  return false;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let x = pos[0];
  let y = pos[1];

  if (this.grid[x][y] === undefined) {
    return false;
  }

  if (this.grid[x][y].color === color) {
    return true;
  } else {
    return false;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let x = pos[0];
  let y = pos[1];
  if (this.grid[x][y] === undefined) {
    return false;
  } else {
    return true;
  }
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
//If both white or black hasMoves === false
Board.prototype.isOver = function () {

};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0];
  let y = pos[1];

  if ((x >= 0 && x <= 7) && (y >= 0 && y <= 7)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  // start at undefined
  // keep moving in the direction of dir
  // collect piecesToFlip if any are on the way
    // only be able to flip them if you raech a piece of the same color as yourself

  if (piecesToFlip === undefined) {
    piecesToFlip = [];
  }
  
  let x = pos[0];
  let y = pos[1];

  let changeX = x + dir[0];
  let changeY = y + dir[1];

  let nextPos = [changeX, changeY];

  if (board.isValidPos(nextPos)) {
    if (board.grid[changeX][changeY] === undefined) {
      return [];
    }
  }
  
  if (board.isValidPos(nextPos)) {
    if (board.grid[changeX][changeY].color === color) {
      return piecesToFlip;
    }
  
    if (board.grid[changeX][changeY].color !== color) {
      piecesToFlip.push([changeX, changeY]);
      piecesToFlip = _positionsToFlip(board, nextPos, color, dir, piecesToFlip);
    }
  } else {
    // throw "The next position in that direction is outside of board bounds";
  }
  return piecesToFlip;
}


/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  // board.placepiece
  // let x = pos[0];
  // let y = pos[1];

  // if (isValidPos(pos)) {
  //   this.grid[]
  // }
  let piecesToFlip = [];

  if (this.grid[pos[0]][pos[1]] !== undefined) {
     new Error("Invalid Move");
  }
   
  // debugger;
  for (let i=0; i < Board.DIRS.length; i++) {
    this.grid[pos[0]][pos[1]] = new Piece(color);
    let flipPos = _positionsToFlip(this, pos, color, Board.DIRS[i], piecesToFlip);

    if (flipPos.length === 0) {
       new Error("Invalid Move");
    }

    flipPos.forEach(fPos => this.grid[fPos[0]][fPos[1]].color = color);
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  this.grid.forEach( row => console.log(row.join(' ')));
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  let x = pos[0];
  let y = pos[1];

  if (this.grid[x][y] !== undefined) {
    return false;
  }


  let piecesToFlip = [];
  let flipPos = []
  for (let i = 0; i < Board.DIRS.length; i++) {
    flipPos = flipPos.concat(_positionsToFlip(this, pos, color, Board.DIRS[i]));
    if (flipPos.length > 0) {
      return true;
    } 
  }

  // if (flipPos.length === 0) {
  //   return false;
  // }

  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validMovesArr = [];

  // this.grid.forEach (function(row) {
  //   row.forEach (function(spot) {
  //     _positionsToFlip()
  //   })
  // })
  let piecesToFlip = [];
  
  // debugger;
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid.length; j++) {
      for (let k = 0; k < Board.DIRS.length; k++) {
        let posFlip = _positionsToFlip(this, [i,j], color, Board.DIRS[k], piecesToFlip);
        if (posFlip.length > 0) {
          validMovesArr.push([i,j]);
          break;
        }
      }
    }
  }
  return validMovesArr; 
};

module.exports = Board;
let b = new Board();
b.validMoves('black');