/* jshint ignore:start */
import device;
import ui.StackView as StackView;
import ui.TextView as TextView;
import ui.GestureView as GestureView;

import src.Grid as Grid;
import src.Score as Score;
import src.Menu as Menu;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(GC.Application, function () {
  var startCells = 2;
  this.initUI = function () {
    this.scaleUI();
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
      backgroundColor: Utils.colors.background,
      swipeMagnitude: 50
    });

    var score = new Score({
      superview: game
    });

    var grid = this.grid = new Grid({
      superview: game
    });

    grid.on('updateScore', function(val) {
      score.update(val);
    });

    game.on('Swipe', bind(this, function(angle, direction) {
      console.log('angle', angle, 'direction', direction);
      grid.moveCells(direction);
      this.addRandomCell();
    }));

    var menu = new Menu({
      superview: game,
      visible: false
    });

    menu.on('Restart', bind(this, function() {
      grid.restart();
      game.setHandleEvents(true);
      menu.hide();
      score.update(0);
      this.launchUI();
    }));

    grid.on('Over', function() {
      console.log('--------------game over!!--------------', game.isHandlingEvents());
      game.setHandleEvents(false);
      menu.show(grid.getBoundingShape());
    });

    rootView.push(game);

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

  this.scaleUI = function() {
    var boundsWidth = 768,
      boundsHeight = 1024,
      deviceWidth = device.screen.width,
      deviceHeight = device.screen.height,
      baseHeight, baseWidth,
      scale, scaleHeight;

    // Portrait mode
    baseWidth = this.baseWidth = boundsWidth;
    baseHeight = this.baseHeight = deviceHeight *
                      (boundsWidth / deviceWidth);
    scale = this.scale = deviceWidth / baseWidth;
    this.view.style.scale = scale;
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
