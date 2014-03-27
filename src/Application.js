/* jshint ignore:start */
import device;
import ui.StackView as StackView;
import ui.TextView as TextView;
import ui.GestureView as GestureView;
import AudioManager;

import src.Grid as Grid;
import src.Score as Score;
import src.Menu as Menu;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(GC.Application, function () {
  var startCells = 2;
  this.initUI = function () {
    var size = this.scaleUI();

    var rootView = new StackView({
      superview: this,
      layout: "box",
      width: size.width,
      height: size.height,
      backgroundColor: Utils.colors.background
    });

    var audio = new AudioManager({
      path: "resources/audio/",
      files: {
        merge: {
          volume: 1
        },
        swype: {
          volume: 1
        }
      }
    });

    var game = new GestureView({
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'space-outside',
      layoutWidth: '100%',
      layoutHeight: '100%',
      swipeMagnitude: 50
    });

    var score = new Score({
      superview: game
    });

    var grid = new Grid({
      superview: game,
      baseWidth: size.width
    });

    grid.on('updateScore', function(val) {
      audio.play('merge');
      score.update(val);
    });

    grid.on('Over', function() {
      console.log('--------------game over!!--------------', game.isHandlingEvents());
      game.setHandleEvents(false);
    });

    grid.on('Restart', bind(this, function() {
      grid.restart();
      game.setHandleEvents(true);
      menu.hide();
      score.reset();
      this.launchUI();
    }));

    game.on('Swipe', bind(this, function(angle, direction) {
      console.log('angle', angle, 'direction', direction);
      audio.play('swype');
      grid.moveCells(direction);
      grid.addRandomCell();
    }));

    var menu = new Menu({});

    menu.on('Play', function() {
      rootView.push(game);
      for(var i=0; i< startCells; i++) {
        grid.addRandomCell();
      }
    });

    this.emulate = function(direction) {
      grid.moveCells(direction);
      grid.addRandomCell();
    };

    rootView.push(menu);
  };

  this.launchUI = function () {
  };

  this.scaleUI = function() {
    var boundsWidth = 768,
      boundsHeight = 1024,
      deviceWidth = device.screen.width,
      deviceHeight = device.screen.height,
      baseHeight, baseWidth,
      scale, scaleHeight;

    // Portrait mode
    baseWidth = boundsWidth;
    baseHeight = deviceHeight *
                      (boundsWidth / deviceWidth);
    scale = deviceWidth / baseWidth;
    this.view.style.scale = scale;
    return { width: baseWidth, height: baseHeight };
  };
});
