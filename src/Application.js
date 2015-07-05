/* jshint ignore:start */
import device;
import ui.TextView as TextView;
import ui.GestureView as GestureView;
import AudioManager;
import event.Callback as Callback;
import googleAnalytics as Analytics;

import src.Utils as Utils;
import src.History as History;
import src.Storage as Storage;
import src.PlayGame as PlayGame;

import src.Grid as Grid;
import src.Score as Score;
import src.Menu as Menu;
import src.Stats as Stats;
import src.Settings as Settings;
import src.Tutorial as Tutorial;
import src.About as About;
/* jshint ignore:end */

exports = Class(GC.Application, function () {
  this.initUI = function () {
    var size = this.scaleUI();

    this.view.updateOpts({
      width: size.width,
      height: size.height,
      backgroundColor: Utils.theme.background
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

    if(localStorage.getItem('mute') === 'true') {
      audio.setMuted(true);
    }

    // Entire puzzle screen accepts swipe actions.
    var game = new GestureView({
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      width: size.width,
      height: size.height,
      swipeMagnitude: 50,
      swipeTime: 1000
    });

    var tutorial = new Tutorial({
      superview: game,
      width: size.width,
      order: 3
    });

    var score = new Score({
      superview: game
    });

    var grid = new Grid({
      superview: game,
      baseWidth: size.width,
      score: score
    });

    var gameInit = function() {
      grid.initCells(bind(game, game.setHandleEvents, true));
      tutorial.start();
    };

    grid.on('updateScore', function() {
      audio.play('merge');
    });

    grid.on('Over', function() {
      game.setHandleEvents(false);
    });

    grid.on('Restart', function() {
      gameInit();
      var evnt = {};
      evnt[grid.mode] = true;
      Analytics.track('newgame', evnt);
    });

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
          if(newCell || grid.mode === 'time') {
            tutorial.swipe();
          }
        });
        grid.moveCells(direction, callback);
      }
    }));

    var menu = new Menu({});

    var pause = this.onPause = bind(this.view, function() {
      if(this.hasView(game)) {
        grid.backButton();
        this.pop();
        menu.refresh();
      }
    });

    menu.on('continue', bind(this.view, function() {
      gameInit();
      History.add(pause, game);
      this.push(game);
    }));

    var newGame = function(mode) {
      grid.setMode(mode);
      Storage.deleteGame();
      tutorial.reset();
      menu.emit('continue');
      var evnt = {};
      evnt[mode] = true;
      Analytics.track('newgame', evnt);
    };
    menu.on('new', bind(this, newGame, 'classic'));
    menu.on('time', bind(this, newGame, 'time'));

    var stats, settings, about;
    menu.on('stats', bind(this, function() {
      if(!stats) {
        stats = new Stats({
          width: size.width,
          height: size.height
        });
      }
      stats.update();
      this.push(stats);
      History.add(bind(this, this.pop), stats);
      Analytics.trackScreen('Stats');
    }));

    var aboutScreen = bind(this, function() {
      if(!about) {
        about = new About({
          width: size.width,
          height: size.height
        });
      }
      this.push(about);
      History.add(bind(this, this.pop), about);
      Analytics.trackScreen('About');
    });

    menu.on('settings', bind(this, function() {
      if(!settings) {
        settings = new Settings({
          audio: audio
        });
        settings.on('about', aboutScreen);
      }
      settings.update();
      this.push(settings);
      History.add(bind(this, this.pop), settings);
      Analytics.trackScreen('Settings');
    }));

    this.push(menu);
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
    this.tabletScale = device.isTablet ? 0.8 : 1;
    return { width: baseWidth, height: baseHeight };
  };

  this.onResume = PlayGame.login;
});
