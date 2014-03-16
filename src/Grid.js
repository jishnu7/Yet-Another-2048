/* jshint ignore:start */
import animate;
import device;
import ui.widget.GridView as GridView;
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
  };

  this.moveCell = function(cell, direction) {
    var x=0, y = 0;
    switch (direction) {
      case 'left':
      case 'right': x = 1; y = 0; break;
      case 'up':
      case 'down': x = 0; y = 1; break;
      default: return;
    }

    var opts = cell._opts,
      col = opts.col,
      row = opts.row,
      anim = animate(cell),
      dir = (direction === 'left' || direction === 'up' ? -1:1);

    var setter = function(prop, value) {
      cell.setProperty('col', col);
    };

    col += x * dir;
    col = col < this.getCols() ? col : this.getCols()-1;
    col = col < 0 ? 0 : col;
    console.log('move: col', col, opts.col, opts.row);

    if(col !== opts.col) {
      anim.then({
        x: this._colInfo[col].pos
      }, 100, animate.linear);
      anim.then(bind(this, setter, 'col', col));
    }

    row += y * dir;
    row = row < this.getRows() ? row : this.getRows()-1;
    row = row < 0 ? 0 : row;
    console.log('move: row', row);
    if(row !== opts.row) {
      anim.then({
        y: this._rowInfo[row].pos
      }, 100, animate.linear);
      anim.then(bind(cell, setter, 'row', row));
    }
  };

  // might be possible to re-wrte in a better way
  this.moveCells = function(direction) {
    var dir = (direction === 'left' || direction === 'up' ? -1:1),
      cols = this.getCols() - 1,
      rows = this.getRows() - 1;

    var setter = function(cell, prop, value) {
      cell.setProperty(prop, value);
    };

    this.getSubviews().forEach(bind(this, function(cell) {
      var opts = cell._opts,
        col = opts.col,
        row = opts.row,
        anim = animate(cell, 'animationGroup'),
        i;

      if(direction === 'left' || direction === 'right') {
        console.log('current row, col', row, col, 'dir', dir);
        i = col;
        while((dir > 0 && i<cols) || (dir < 0 && i>0)) {
          i += dir;
          console.log('iscell available', row, i, this.isCellAvailable(row, i));
          if(!this.isCellAvailable(row, i)) {
            console.log('breaking', i);
            i -= dir;
            break;
          }
        }

        console.log('animating from', col, '=>', i);
        col = i;
        if(col !== opts.col) {
          anim.then({
            x: this._colInfo[col].pos
          }, 100, animate.linear);
          anim.then(bind(this, setter, cell, 'col', col));
        }
      } else {
        console.log('current row, col', row, col, 'dir', dir);
        i = row;
        while((dir > 0 && i<rows) || (dir < 0 && i>0)) {
          i += dir;
          console.log('iscell available', row, i);
          if(!this.isCellAvailable(i, col)) {
            console.log('breaking', i);
            i -= dir;
            break;
          }
        }

        console.log('animating from', row, '=>', i);
        if(i !== opts.row) {
          anim.then({
            y: this._rowInfo[i].pos
          }, 100, animate.linear);
          anim.then(bind(this, setter, cell, 'row', i));
        }
      }
    }));
  };

  this.getCells = function() {
    var cells = [];
    // init with empty data
    for (var x = 0; x < this.getRows(); x++) {
      var row = [];
      for (var y = 0; y < this.getCols(); y++) {
        row.push(null);
      }
      cells.push(row);
    }

    // get existing cells
    this.getSubviews().forEach(function(view) {
      var opts = view._opts;
      cells[opts.row][opts.col] = view;
    });

    return cells;
  };

  this.getCell = function (row, col) {
    return this.getCells()[row][col];
  };

  this.eachCell = function(callback) {
    var cells = this.getCells();
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

});
