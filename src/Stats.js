/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;
import ui.ViewPool as ViewPool;
import src.gc.ButtonView as ButtonView;

import src.Utils as Utils;
import src.PlayGame as PlayGame;
import src.Storage as Storage;
import util.underscore as _;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      direction: 'vertical'
    });
    supr(this, 'init', [opts]);

    new TextView({
      superview: this,
      layout: 'box',
      centerX: true,
      layoutWidth: '90%',
      height: 60,
      text: 'Stats',
      size: 60,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.text,
      horizontalAlign: 'left',
      top: 50
    });

    var containerPlay = new View({
      superview: this,
      layout: 'linear',
      justifyContent: 'space',
      layoutWidth: '90%',
      height: 80,
      centerX: true,
      top: 50
    });

    new ButtonView({
      superview: containerPlay,
      centerX: true,
      width: 362,
      height: 75,
      scale: 0.9,
      images: {
        up: 'resources/images/btn_achievements.png',
        down: 'resources/images/btn_achievements_down.png'
      },
      on: {
        up: PlayGame.showAchievements
      }
    });

    new ButtonView({
      superview: containerPlay,
      centerX: true,
      width: 362,
      height: 75,
      scale: 0.9,
      images: {
        up: 'resources/images/btn_leaderboard.png',
        down: 'resources/images/btn_leaderboard_down.png'
      },
      on: {
        up: PlayGame.showLeaderBoard
      }
    });

    var statView = Class(View, function(supr) {
      this.init = function(opts) {
        merge(opts, {
          layout: 'linear',
          justifyContent: 'space',
          centerX: true,
          top: 10
        });
        supr(this, 'init', [opts]);

        this.key = new TextView({
          superview: this,
          layoutWidth: '50%',
          color: Utils.colors.text,
          size: 60,
          fontFamily: Utils.fonts.text,
          horizontalAlign: 'left',
        });

        this.value = new TextView({
          superview: this,
          layoutWidth: '50%',
          size: 60,
          color: Utils.colors.text,
          fontFamily: Utils.fonts.text,
          horizontalAlign: 'right',
        });
      };
    });

    this.statView = new ViewPool({
      ctor: statView,
      initCount: 10,
      initOpts: {
        width: opts.width - 100,
        height: 60
      }
    });

    this.on('ViewDidDisappear', bind(this.statView, function() {
      this.releaseAllViews();
    }));

    this.addStat = bind(this, this.addStat);
  };

  this.update = function() {
    var tiles = Storage.getTileStats(),
      tileKeys = Object.keys(tiles).reverse(),
      games = Storage.getGameStats(),
      stats = {
        time: {
          score: 0,
          number: 0
        },
        classic: {
          score: 0,
          number: 0,
          time: 0
        }
      };

    _.forEach(games, function(game) {
      if(game.mode === 'time') {
        stats.time.score += game.time;
        stats.time.number += 1;
      } else {
        stats.classic.score += game.score;
        stats.classic.number += 1;
        stats.classic.time += game.time;
      }
    });

    _.forEach(stats.time, this.addStat);
    _.forEach(stats.classic, this.addStat);

    _.forEach(tileKeys, bind(this, function(key) {
      this.addStat(tiles[key], key);
    }));
  };

  this.addStat = function(val, prop) {
    var stat = this.statView.obtainView();
    stat.updateOpts({
      superview: this,
      visible: true
    });
    stat.key.updateOpts({
      text: prop
    });
    stat.value.updateOpts({
      text: val
    });
  };
});
