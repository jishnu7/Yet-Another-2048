/* jshint ignore:start */
import animate;
import ui.ViewPool as ViewPool;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;
import ui.resource.Image as Image;
import event.Callback as Callback;
import src.gc.GridView as GridView;

import src.Cell as Cell;
import src.Utils as Utils;
import src.PlayGame as PlayGame;
import src.Storage as Storage;
/* jshint ignore:end */

exports = Class(GridView, function(supr) {
  var StartCells = 2;

  this.init = function(opts) {
    var size = 4,
      margin = 10,
      baseSize = opts.baseWidth - 100,
      cellSize = Math.round((baseSize-margin*2)/size) - margin*2;
    baseSize = (cellSize + margin*2) * size + margin*2;

    merge(opts, {
      layout: 'box',
      centerX: true,
      width: baseSize,
      height: baseSize,
      rows: size,
      cols: size,
      cellSize: cellSize,
      horizontalMargin: margin,
      verticalMargin: margin,
      autoCellSize: false,
      scale: GC.app.scale,
      image: 'resources/images/grid.png',
      scaleMethod: '9slice',
      sourceSlices: {
        horizontal: {
          left: 20,
          center: 10,
          right: 20
        },
        vertical: {
          top: 20,
          middle: 10,
          bottom: 20
        }
      }
    });
    supr(this, 'init', [opts]);
    this.overlay = this.initOverlay(baseSize);

    // init cells with empty data
    var cells = [];
    for (var x = 0; x < this.getRows(); x++) {
      var row = [];
      for (var y = 0; y < this.getCols(); y++) {
        row.push(null);
        new ImageView({
          superview: this,
          row: x,
          col: y,
          width: cellSize,
          height: cellSize,
          image: 'resources/images/cell_blank.png'
        });
      }
      cells.push(row);
    }
    this.cells = cells;

    this.cellPool = new ViewPool({
      ctor: Cell,
      initCount: size*size,
      initOpts: {
        width: cellSize,
        height: cellSize
      }
    });

    this.on('ViewDidDisappear', function() {
      this.cellPool.releaseAllViews();
    });

    this.score = opts.score;
  };

  // Function to load saved game from local storage.
  this.loadGame = function(cb) {
    var game = Storage.getGame(),
      cells, length, finish;
    if(game) {
      cells = game.cells;
      length = cells.length;

      finish = Utils.finish(length, bind(this, function() {
        this.timer = this.timeMode(game.speed);
        cb();
      }));

      this.setMode(game.mode);
      this.score.load(game.score, game.highestTile, game.timer);
      for(var i=0; i<length; i++) {
        var cell = cells[i];
        this.addCell(parseInt(cell.row, 10), parseInt(cell.col, 10),
          parseInt(cell.value, 10));
        finish();
      }
      return true;
    }
    return false;
  };

  // Function to set mode of the game.
  // currently used modes are `classic` and `time`
  this.setMode = function(mode) {
    this.mode = mode;
    this.score.setMode(mode);
  };

  this.stopTimer = function() {
    this.timer.stop();
    this.score.stop();
  };

  this.gameOver = function() {
    var score = this.score;
    this.stopTimer();
    this.emit('Over');
    Storage.deleteGame();
    this.overlay.show();

    // Stats and leaderboard
    Storage.saveGameStats(this);
    score.saveHighScore();
    if(this.mode === 'time') {
      PlayGame.leaderboard('time', score.score*1000);
    } else {
      PlayGame.leaderboard('score', score.score);
      PlayGame.leaderboard('tile', score.highestTile);
    }
  };

  // First function to call from menu screen
  // if state of the game is ongoing, it loads from storage
  // otherwise creates a new game.
  this.initCells = function(cb) {
    this.overlay.hide();
    if(!this.loadGame(cb)) {
      this.reset();
      for(var i = 0; i < StartCells; i++) {
        this.addRandomCell();
      }
      this.timer = this.timeMode();
      cb();
    }
  };

  this.addRandomCell = function() {
    var value = Math.random() < 0.9 ? 2 : 4,
      pos = this.randomAvailableCell();

    if(pos) {
      this.addCell(pos.row, pos.col, value);
    } else if(this.mode === 'time') {
      this.gameOver();
    }
  };

  this.timeMode = function(t) {
    var stop = false;
    t = t || 1250;

    if(this.mode === 'time') {
      var timer = bind(this, function() {
        // max speed 500 milli seconds
        if(t > 500) {
          t -= 1;
        }
        if(!stop) {
          this.addRandomCell();
          setTimeout(timer, t);
        }
      });
      setTimeout(timer, t);
    }
    this.score.start();

    return {
      stop: function() {
        stop = true;
      },
      get: function() {
        return t;
      }
    };
  };

  this.backButton = function() {
    if(!this.overlay.isVisible()) {
      this.stopTimer();
      Storage.saveGame(this);
    }
  };

  this.addCell = function(row, col, val) {
    var cell = this.cellPool.obtainView();

    cell.updateOpts({
      superview: this,
      row: row,
      col: col,
      scale: 0.1,
      visible: true
    });
    cell.setValue(val);

    this.cells[row][col] = cell;
    this.reflow();
    var anim = animate(cell);
    anim.now({
      scale: 0.1
    }, 0).
    then({
      scale: 1
    }, 100);
  };

  this.removeCell = function(cell) {
    var row = cell._opts.row,
      col = cell._opts.col;
    if(this.cells[row][col] === cell) {
      this.cells[row][col] = null;
    }
    var anim = animate(cell);
    anim.now({
      scale: 1
    }, 0).
    then({
      scale: 1.2
    }, 100, animate.linear).
    then({
      scale: 1
    }, 100, animate.linear).
    then(bind(this, function() {
      this.cellPool.releaseView(cell);
    }));
  };

  this.mergeCells = function(cell1, cell2) {
    var newVal = cell1.getValue() + cell2.getValue();
    cell1.setValue(newVal);
    cell2.setValue(newVal);
    PlayGame.achievement(newVal);
    Storage.saveTileStats(newVal);
    this.removeCell(cell2);
    this.score.update(newVal);
    this.emit('updateScore', newVal);
  };

  this.moveCells = function(direction, cb) {
    var mergedCells = [],
      vector = Utils.getVector(direction),
      traversals = this.buildTraversals(vector),
      moveMade = false,
      finish = Utils.finish(traversals.row.length * traversals.col.length, bind(this, function() {
        if(this.mode === 'time') {
          moveMade = false;
        } else if(!(this.isCellsAvailable() || this.isMovesAvailable())) {
          this.gameOver();
        }
        cb.fire(moveMade);
      }));

    traversals.col.forEach(bind(this, function (x) {
      traversals.row.forEach(bind(this, function (y) {
        var cell = this.getCell(y, x),
          callback = new Callback();
        callback.run(finish);

        if (cell) {
          var pos = this.findFarthestPosition({ row: y, col: x }, vector),
            next = pos.next ? this.getCell(pos.next.row, pos.next.col) : null;

          if (next && next.getValue() === cell.getValue() && mergedCells.indexOf(next) === -1) {
            // Merge
            moveMade = true;
            this.moveCell(cell, pos.next, callback);
            mergedCells.push(cell);
            this.mergeCells(cell, next);
          } else if(this.moveCell(cell, pos.farthest, callback)) {
            // Move without merge
            moveMade = true;
          }
        } else {
          callback.fire();
        }
      }));
    }));
  };

  this.moveCell = function(cell, farthest, cb) {
    var anim = animate(cell, 'animationGroup'),
      opts = cell._opts,
      col = farthest.col,
      row = farthest.row,
      prevCol = opts.col,
      prevRow = opts.row,
      target = this.getCellPos(row, col);

    this.cells[prevRow][prevCol] = null;
    this.cells[row][col] = cell;
    if(col !== opts.col || row !== opts.row) {
      anim.then({
          x: target.x,
          y: target.y
        }, 100, animate.linear).
        then(function(){
          cell.setProperty('col', col);
          cell.setProperty('row', row);
          cb && cb.fire();
        }, 0);
      return true;
    } else {
      cb && cb.fire();
      return false;
    }
  };

  this.getCell = function (row, col) {
    var rows = this.getRows(),
      cols = this.getCols();
    if(row >= rows || row < 0 || col < 0 || col >= cols) {
      return false;
    }
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
    return false;
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
    var previous;

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
    var opts = this._opts;

    return {
      x: this._colInfo[col].pos + opts.horizontalMargin,
      y: this._rowInfo[row].pos + opts.verticalMargin
    };
  };

  this.isMovesAvailable = function () {
    var flag = false,
      directions = ['left', 'right', 'up', 'down'];

    this.eachCell(bind(this, function(row, col, cell) {
      if(cell) {
        directions.forEach(bind(this, function(direction) {
          var vector = Utils.getVector(direction),
            other = this.getCell(row + vector.row, col + vector.col);

          if (other && other.getValue() === cell.getValue()) {
            flag = true;
          }
        }));
      }
    }));
    return flag;
  };

  this.reset = function() {
    var cell = this.cells;
    for (var x = 0; x < this.getRows(); x++) {
      for (var y = 0; y < this.getCols(); y++) {
        cell[x][y] = null;
      }
    }
    this.overlay.hide();
    this.cellPool.releaseAllViews();
    this.score.reset();
  };

  this.initOverlay = function(size) {
    var bg = new ImageScaleView({
      superview: this,
      inLayout: false,
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      visible: false,
      zIndex: 2,
      opacity: 0.0,
      width: size,
      height: size,
      image: 'resources/images/grid.png',
      scaleMethod: '9slice',
      sourceSlices: {
        horizontal: {
          left: 20,
          center: 10,
          right: 20
        },
        vertical: {
          top: 20,
          middle: 10,
          bottom: 20
        }
      }
    });

    var replay = new Image({url: 'resources/images/replay.png'});
    var img = new ImageView({
      superview: bg,
      width: replay.getWidth(),
      height: replay.getHeight(),
      image: replay,
      x: 0,
      y: 0,
      centerX: true
    });

    img.on('InputOut', bind(this, function() {
      this.emit('Restart');
    }));

    return {
      show: function() {
        bg.style.visible = true;
        animate(bg).
          now(function() {
            img.setHandleEvents(false);
          }, 0).
          then({
            opacity: 0.8
          }, 1000).
          then(function() {
            img.setHandleEvents(true);
          });
      },
      hide: function() {
        bg.style.opacity = 0;
        bg.style.visible = false;
      },
      isVisible: function() {
        return bg.style.visible;
      }
    };
  };
});
