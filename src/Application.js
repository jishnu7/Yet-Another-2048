/* jshint ignore:start */
import ui.View as View;
import ui.StackView as StackView;
import ui.TextView as TextView;
import ui.GestureView as GestureView;

import src.Grid as Grid;
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
      text: 0,
      size: 30,
      height: 50,
    });

    var grid = new Grid({
      superview: game
    });

    grid.on('updateScore', function(val) {
      score.setText(parseInt(score.getText(),10) + val);
    });

    game.on('Swipe', bind(this, function(angle, direction) {
      console.log('angle', angle, 'direction', direction);
      grid.moveCells(direction);
      this.addRandomCell();
    }));

    rootView.push(game);
    this.grid = grid;

    this.emulate = function(direction) {
      grid.moveCells(direction);
      this.addRandomCell();
    };
  };

  this.launchUI = function () {
    for(var i=0; i< startCells; i++) {
      this.addRandomCell();
    }
  };

  this.addRandomCell = function() {
    var grid = this.grid,
      value = Math.random() < 0.9 ? 2 : 4;
      pos = grid.randomAvailableCell();
    if(grid.isCellsAvailable()) {
      grid.addCell(pos.row, pos.col, value);
    }
  };
});
