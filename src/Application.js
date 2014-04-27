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
import src.History as History;
import src.PlayGame as PlayGame;
import src.Stats as Stats;
import src.Settings as Settings;
/* jshint ignore:end */

exports = Class(GC.Application, function () {
  this.initUI = function () {
    var size = this.scaleUI();

    this.view.updateOpts({
      layout: 'box',
      width: size.width,
      height: size.height,
      backgroundColor: Utils.colors.background
    });

    var audio = new AudioManager({
      path: 'resources/audio/',
      files: {
        merge: {
          volume: 1
        },
        swipe: {
          volume: 1
        }
      }
    });
    audio.setMuted(true);

    // Entire puzzle screen accepts swipe actions.
    var game = new GestureView({
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      layoutWidth: '100%',
      layoutHeight: '100%',
      swipeMagnitude: 50,
      swipeTime: 1000
    });

    var score = new Score({
      superview: game
    });

    var grid = new Grid({
      superview: game,
      baseWidth: size.width,
      score: score
    });

    grid.on('updateScore', function() {
      audio.play('merge');
    });

    grid.on('Over', function() {
      game.setHandleEvents(false);
    });

    grid.on('Restart', bind(this, function() {
      grid.initCells();
      game.setHandleEvents(true);
    }));

    var busy = false;
    game.on('Swipe', bind(this, function(angle, direction) {
      if(!busy) {
        busy = true;
        audio.play('swipe');
        var callback = new Callback();
        callback.run(function(newCell) {
          busy = false;
          // add a new cell only if a move is made.
          newCell && grid.addRandomCell();
        });
        grid.moveCells(direction, callback);
      }
    }));

    var menu = this.menu = new Menu({
      game: grid
    });

    var pause = this.onPause = bind(this.view, function() {
      if(this.hasView(game)) {
        menu.refresh();
        this.pop();
        grid.backButton();
      }
    });

    menu.on('continue', bind(this.view, function() {
      grid.initCells();
      game.setHandleEvents(true);

      History.add(pause);

      this.push(game);
    }));

    menu.on('new', bind(this, function() {
      grid.setMode('classic');
      grid.setGameState('over');
      menu.emit('continue');
    }));

    menu.on('time', bind(this, function() {
      grid.setMode('time');
      grid.setGameState('over');
      menu.emit('continue');
    }));

    menu.on('signin', bind(this, this.playGameLogin, true));
    menu.on('signout', function() {
      PlayGame.logout();
      menu.updateLogin();
    });

    var stats, settings;
    menu.on('stats', bind(this, function() {
      if(!stats) {
        stats = new Stats({});
      }
      this.push(stats);
      History.add(bind(this, this.pop));
    }));

    menu.on('settings', bind(this, function() {
      if(!settings) {
        settings = new Settings({});
      }
      this.push(settings);
      History.add(bind(this, this.pop));
    }));

    this.view.push(menu);
  };

  this.launchUI = function () {
    device.setBackButtonHandler(History.release);
  };

  // Function to scale the UI.
  this.scaleUI = function() {
    var boundsWidth = 768,
      //boundsHeight = 1024,
      deviceWidth = device.screen.width,
      deviceHeight = device.screen.height,
      baseHeight, baseWidth,
      scale;

    // Portrait mode
    baseWidth = boundsWidth;
    baseHeight = deviceHeight *
                      (boundsWidth / deviceWidth);
    scale = deviceWidth / baseWidth;
    this.view.style.scale = scale;
    return { width: baseWidth, height: baseHeight };
  };

  this.onResume = this.playGameLogin = function(force) {
    var menu = this.menu;
    PlayGame.login(function(){
      menu.updateLogin();
    }, force);
  };
});
