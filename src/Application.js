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
/* jshint ignore:end */

exports = Class(GC.Application, function () {
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
      justifyContent: 'center',
      layoutWidth: '100%',
      layoutHeight: '100%',
      swipeMagnitude: 50
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
        audio.play('swype');
        var callback = new Callback();
        callback.run(function(newCell) {
          busy = false;
          newCell && grid.addRandomCell();
        });
        grid.moveCells(direction, callback);
      }
    }));

    var menu = this.menu = new Menu({
      game: grid
    });

    menu.on('Continue', function() {
      grid.initCells();
      game.setHandleEvents(true);

      History.add(function() {
        menu.refresh();
        rootView.pop();
        grid.overlay.hide();
        grid.saveGame();
      });

      rootView.push(game);
    });

    menu.on('New-Game', bind(this, function() {
      grid.setMode('classic');
      grid.setGameState('over');
      menu.emit('Continue');
    }));

    menu.on('Time-Mode', bind(this, function() {
      grid.setMode('time');
      grid.setGameState('over');
      menu.emit('Continue');
    }));

    menu.on('Sign-In', bind(this, this.playGameLogin, true));
    menu.on('Sign-Out', function() {
      PlayGame.logout();
      menu.updateLogin();
    });

    menu.on('Leaderboard', function() {
      PlayGame.showLeaderBoard();
    });
    menu.on('Achievements', function() {
      PlayGame.showAchievements();
    });

    rootView.push(menu);
  };

  this.launchUI = function () {
    device.setBackButtonHandler(History.release);
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

  this.onResume = this.playGameLogin = function(force) {
    var menu = this.menu;
    PlayGame.login(function(evt){
      menu.updateLogin();
    }, force);
  };
});
