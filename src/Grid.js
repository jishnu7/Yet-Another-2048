/* jshint ignore:start */
import animate;
import device;
import ui.View as View;
import ui.widget.GridView as GridView;

import src.Cell as Cell;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(GridView, function(supr) {
  var size = 4,
    margin = 8,
    baseSize = device.width - 10;
    cellSize = Math.round(baseSize/4) - margin*1.5;
  baseSize = (cellSize + margin*1.5) * 4;

  this.init = function(opts) {

    merge(opts, {
      layout: 'box',
      centerX: true,
      backgroundColor: 'red',
      width: baseSize,
      height: baseSize,
      rows: size,
      cols: size,
      horizontalMargin: margin,
      verticalMargin: margin,
      autoCellSize: false
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
          width: cellSize,
          height: cellSize,
          backgroundColor: 'green',
        });
      }
      cells.push(row);
    }
    this.cells = cells;
  };

  this.addCell = function(row, col, val) {
    var cell = new Cell({
      superview: this,
      layout: 'box',
      row: row,
      col: col,
      width: cellSize,
      height: cellSize,
      value: val,
      centerAnchor: true,
      scale: 0.1
    });
    this.cells[row][col] = cell;
    this.reflow();
    var anim = animate(cell);
    anim.now({
      scale: 0.1
    }, 0).
    then({
      scale: 1
    }, 100);
    console.log('addcell', [row, col], val);
  };

  this.removeCell = function(cell) {
    var row = cell._opts.row,
      col = cell._opts.col;
    if(this.cells[row][col] === cell) {
      this.cells[row][col] = null;
    }
    console.log('removing', row, col);
    var anim = animate(cell);
    anim.now({
      scale: 1
    }, 0).
    then({
      scale: 0.1
    }, 100)
    .then(bind(cell, function() {
      this.removeFromSuperview();
    }));
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
      target = this.getCellPos(row, col);

    this.cells[prevRow][prevCol] = null;
    this.cells[row][col] = cell;
    console.log('moving', prevRow, prevCol, '=>', row, col);
    if(col !== opts.col || row !== opts.row) {
      anim.then({
          x: target.x,
          y: target.y
        }, 100, animate.linear).
        then(function(){
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

  this.getCellSize = function(row, col) {
    return {
        width: this._colInfo[col].size,
        height: this._rowInfo[row].size
      };
  };

  this.getCellPos = function(row, col) {
    var opts = this._opts,
      marginH = (row===0 ? opts.horizontalMargin : opts.horizontalMargin/2),
      marginV = (col===0 ? opts.verticalMargin: opts.verticalMargin/2);

    return {
      x: this._colInfo[col].pos + marginH,
      y: this._rowInfo[row].pos + marginV
    };
  };

  this._updateSubview = function (subview) {
    var opts = this._opts,
      subviewOpts = subview._opts,
      row = subviewOpts.row,
      col = subviewOpts.col,
      style = subview.style,
      horizontalMargin = opts.horizontalMargin,
      verticalMargin = opts.verticalMargin;

    // Check is the range is valid...
    if ((row < 0) || (row >= this._rows) || (col < 0) || (col >= this._cols)) {
      if (opts.hideOutOfRange) {
        subview.style.visible = false;
      }
      return;
    } else if (opts.showInRange) {
      subview.style.visible = true;
    }

    if(col===0) {
      style.x = this._colInfo[col].pos + horizontalMargin;
    } else {
      style.x = this._colInfo[col].pos + horizontalMargin/2;
    }
    if(row===0) {
      style.y = this._rowInfo[row].pos + verticalMargin;
    } else {
      style.y = this._rowInfo[row].pos + verticalMargin/2;
    }
  };

});
