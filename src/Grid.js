/* jshint ignore:start */
import animate;
import device;
import ui.View as View;
import ui.widget.GridView as GridView;

import src.Cell as Cell;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(GridView, function(supr) {
  this.init = function(opts) {
    merge(opts, {
      layout: 'box',
      centerX: true,
      backgroundColor: 'red',
      width: device.width - 10,
      height: device.width - 10,
      rows: 4,
      cols: 4,
      horizontalMargin: 5,
      verticalMargin: 5
    });
    supr(this, 'init', [opts]);

    // init cells with empty data
    var cells = [];
    for (var x = 0; x < this.getRows(); x++) {
      var row = [];
      for (var y = 0; y < this.getCols(); y++) {
        row.push(null);
        new View({
          superview: this,
          row: x,
          col: y,
          backgroundColor: 'green'
        });
      }
      cells.push(row);
    }
    this.cells = cells;
  };

  this.addCell = function(row, col, val) {
    var cell = new Cell({
      superview: this,
      row: row,
      col: col,
      value: val
    });
    this.cells[row][col] = cell;
    this.reflow();
    console.log('addcell', [row, col], val);
  };

  this.removeCell = function(cell) {
    var row = cell._opts.row,
      col = cell._opts.col;
    if(this.cells[row][col] === cell) {
      this.cells[row][col] = null;
    }
    console.log('removing', row, col);
    cell.removeFromSuperview();
  };

  this.mergeCells = function(cell1, cell2) {
    var newVal = cell1.getValue() + cell2.getValue();
    cell1.setVal(newVal);
    this.removeCell(cell2);
    this.emit('updateScore', newVal);
  };

  // might be possible to re-wrte in a better way
  this.moveCells = function(direction) {
    var dir = (direction === 'left' || direction === 'up' ? -1:1),
      cols = this.getCols() - 1,
      rows = this.getRows() - 1;

    var vector = Utils.getVector(direction);
    var traversals = this.buildTraversals(vector);
    traversals.col.forEach(bind(this, function (x) {
      traversals.row.forEach(bind(this, function (y) {
        var cell = this.getCell(y, x);

        if (cell) {
          var pos = this.findFarthestPosition({ row: y, col: x }, vector),
            next = pos.next ? this.getCell(pos.next.row, pos.next.col) : null;

            if (next && next.getValue() === cell.getValue()) {
              console.log('merge cells', [y,x], cell.getValue(), pos.next, next.getValue());
              this.moveCell(cell, pos.next);
              this.mergeCells(cell, next);
            } else {
              this.moveCell(cell, pos.farthest);
            }
        }
      }));
    }));
  };

  this.moveCell = function(cell, farthest) {
    var anim = animate(cell, 'animationGroup'),
      opts = cell._opts,
      col = farthest.col,
      row = farthest.row,
      prevCol = opts.col,
      prevRow = opts.row;

    this.cells[prevRow][prevCol] = null;
    this.cells[row][col] = cell;
    console.log('moving', prevRow, prevCol, '=>', row, col);
    if(col !== opts.col || row !== opts.row) {
      anim.now({
        x: this._colInfo[prevCol].pos,
        y: this._rowInfo[prevRow].pos
      }, 0)
      .then({
        x: this._colInfo[col].pos,
        y: this._rowInfo[row].pos
      }, 100, animate.linear).then(function(){
        cell.setProperty('col', col);
        cell.setProperty('row', row);
      }, 0);
    }
  };

  this.getCell = function (row, col) {
    return this.cells[row][col];
  };

  this.eachCell = function(callback) {
    var cells = this.cells;
    for (var row = 0; row < this.getCols(); row++) {
      for (var col = 0; col < this.getRows(); col++) {
        callback(row, col, cells[row][col]);
      }
    }
  };

  this.availableCells = function() {
    var cells = [];

    this.eachCell(function(row, col, cell) {
      if(!cell) {
        cells.push({row: row, col: col});
      }
    });
    return cells;
  };

  this.randomAvailableCell = function () {
    var cells = this.availableCells();

    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];
    }
  };

  this.isCellsAvailable = function () {
    return !!this.availableCells().length;
  };

  this.isCellAvailable = function (row, col) {
    return !this.getCell(row, col);
  };

  this.withinBounds = function(row, col) {
    return col >= 0 && col < this.getCols() &&
      row >= 0 && row < this.getRows();
  };

  this.buildTraversals = function(vector) {
    var trav = {
        col: [],
        row: []
      },
      pos = 0;

    for (pos = 0; pos < this.getCols(); pos++) {
      trav.col.push(pos);
    }
    for (pos = 0; pos < this.getCols(); pos++) {
      trav.row.push(pos);
    }

    if (vector.col === 1) {
      trav.col = trav.col.reverse();
    }
    if(vector.row === 1) {
      trav.row = trav.row.reverse();
    }

    return trav;
  };

  this.findFarthestPosition = function (cell, vector) {
    var previous, ret = {};

    do {
      previous = cell;
      cell = {
        col: previous.col + vector.col,
        row: previous.row + vector.row
      };
    } while (this.withinBounds(cell.row, cell.col) &&
             this.isCellAvailable(cell.row, cell.col));

    return {
      farthest: previous,
      next: this.withinBounds(cell.row, cell.col) ? cell : null
    };
  };
});
