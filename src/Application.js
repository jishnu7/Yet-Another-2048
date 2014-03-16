/* jshint ignore:start */
import ui.View as View;
import ui.StackView as StackView;
import ui.TextView as TextView;
import ui.GestureView as GestureView;

import src.Grid as Grid;
import src.Cell as Cell;
/* jshint ignore:end */

exports = Class(GC.Application, function () {
  var startCells = 2;
  this.initUI = function () {
    var rootView = new StackView({
      superview: this,
      layout: "box",
      backgroundColor: 'white'
    });

    var game = new GestureView({
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'space-outside',
      layoutWidth: '100%',
      layoutHeight: '100%',
    });

    var score = new TextView({
      superview: game,
      layout: 'box',
      color: 'red',
      text: '2048',
      size: 30,
      height: 50,
    });

    var grid = new Grid({
      superview: game
    });

    game.on('Swipe', function(angle, direction) {
      console.log('angle', angle, 'direction', direction);
      grid.moveCells(direction);
    });

    rootView.push(game);
    this.grid = grid;

    for(var i=0; i< startCells; i++) {
      this.addRandomCell();
    }
  };

  this.launchUI = function () {};

  this.addRandomCell = function() {
    var grid = this.grid,
      value = Math.random() < 0.9 ? 2 : 4;
      pos = grid.randomAvailableCell();
    if(grid.isCellsAvailable()) {
      new Cell({
        superview: this.grid,
        col: pos.col,
        row: pos.row,
        value: value
      });
    }
  };
});
