/* jshint ignore:start */
import device;
import ui.StackView as StackView;
import ui.TextView as TextView;
import ui.GestureView as GestureView;
import AudioManager;
import event.Callback as Callback;

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
    }));

    var busy = false;
    game.on('Swipe', bind(this, function(angle, direction) {
      console.log('angle', angle, 'direction', direction, busy);
      if(!busy) {
        busy = true;
        audio.play('swype');
        var callback = new Callback();
        callback.run(function() {
          busy = false;
          grid.addRandomCell();
        });
        grid.moveCells(direction, callback);
      }
    }));

    var menu = new Menu({});

    menu.on('Play', function() {
      rootView.push(game);
      grid.initCells();
    });

    this.emulate = function(direction) {
      game.emit('Swipe', 1, direction);
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
