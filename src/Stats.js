/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;
import ui.ViewPool as ViewPool;
import src.gc.ButtonView as ButtonView;
import src.gc.ScrollView as ScrollView;

import src.Utils as Utils;
import src.PlayGame as PlayGame;
import src.Storage as Storage;
import util.underscore as _;
/* jshint ignore:end */

exports = Class(ScrollView, function(supr) {
  var strings = {
      count: 'Games played',
      score: 'Total score',
      time: 'Total time',
      tile: 'Highest tile',
      averageTile: 'Avg. highest tile',
      averageScore: 'Avg. score',
      averageTime: 'Avg. time',
      longest: 'Longest',
      highScore: 'High score'
    },
    getMode = function(array) {
      var len = array.length;
      if(len === 0) {
        return 0;
      }

      var modeMap = {},
        maxEl = array[0],
        maxCount = 1;
      array.forEach(function(el) {
        modeMap[el] = modeMap[el] ? modeMap[el] + 1 : 1;
        if(modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
        }
      });
      return maxEl;
    };

  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      direction: 'vertical',
      scrollX: false,
      bounce: false,
      useLayoutBounds: true
    });
    supr(this, 'init', [opts]);

    this._contentView.updateOpts({
      layoutWidth: '90%',
      scale: GC.app.tabletScale
    });

    new TextView({
      superview: this,
      layout: 'box',
      centerX: true,
      height: 60,
      text: 'Stats',
      size: 60,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.text,
      horizontalAlign: 'left',
      top: 50,
      order: 1
    });

    var img_achievement = Utils.getButtonImage('achievements', true),
      img_leaderboard = Utils.getButtonImage('leaderboard', true),
      containerPlay = new View({
        superview: this,
        layout: 'linear',
        justifyContent: 'space-outside',
        height: img_achievement.up.getHeight(),
        centerX: true,
        top: 50,
        order: 2
      });

    new ButtonView({
      superview: containerPlay,
      centerX: true,
      width: img_achievement.up.getWidth(),
      height: img_achievement.up.getHeight(),
      images: img_achievement,
      on: {
        up: PlayGame.showAchievements
      }
    });


    new ButtonView({
      superview: containerPlay,
      centerX: true,
      width: img_leaderboard.up.getWidth(),
      height: img_leaderboard.up.getHeight(),
      images: img_leaderboard,
      on: {
        up: PlayGame.showLeaderBoard
      }
    });

    this.textPool = new ViewPool({
      ctor: TextView,
      initCount: 4,
      initOpts: {
        superview: this,
        layout: 'box',
        centerX: true,
        height: 60,
        size: 45,
        color: Utils.colors.text,
        fontFamily: Utils.fonts.text,
        horizontalAlign: 'left',
        top: 50
      }
    });

    var statView = Class(View, function(supr) {
      this.init = function(opts) {
        merge(opts, {
          layout: 'linear',
          justifyContent: 'space',
          centerX: true
        });
        supr(this, 'init', [opts]);

        this.key = new TextView({
          superview: this,
          layout: 'box',
          layoutWidth: '50%',
          color: Utils.colors.text,
          size: 35,
          fontFamily: Utils.fonts.number,
          horizontalAlign: 'left'
        });

        this.value = new TextView({
          superview: this,
          layout: 'box',
          layoutWidth: '50%',
          size: 35,
          color: Utils.colors.text,
          fontFamily: Utils.fonts.number,
          horizontalAlign: 'right'
        });
      };
    });

    this.statView = new ViewPool({
      ctor: statView,
      initCount: 25,
      initOpts: {
        height: 60
      }
    });

    this.on('ViewDidDisappear', bind(this, function() {
      this.statView.releaseAllViews();
      this.textPool.releaseAllViews();
    }));

    this.addTitle = bind(this, this.addTitle);
  };

  this.update = function() {
    var tiles = Storage.getTileStats(),
      tileKeys = Object.keys(tiles).reverse(),
      games = Storage.getGameStats(),
      i = 3,
      order = [
        'count', 'time', 'longest', 'averageTime',
        'score', 'highScore', 'averageScore', 'tile', 'averageTile'
      ],
      statsTime = {
        count: 0,
        time: 0,
        longest: 0,
        averageTime: 0,
        tile: 0,
        averageTile: 0
      },
      statsClassic = {
        count: 0,
        score: 0,
        highScore: 0,
        averageScore: 0,
        time: 0,
        longest: 0,
        averageTime: 0,
        tile: 0,
        averageTile: 0
      },
      tile = {
        time: [],
        classic: []
      };

    var finish = Utils.finish(_.keys(games).length, bind(this, function() {
      if(statsTime.count > 0) {
        statsTime.averageTile = getMode(tile.time);
        statsTime.averageTime = Utils.humanTime(statsTime.time/statsTime.count);
        statsTime.time = Utils.humanTime(statsTime.time);
        statsTime.longest = Utils.humanTime(statsTime.longest);
      }

      if(statsClassic.count > 0) {
        statsClassic.averageTile = getMode(tile.classic);
        statsClassic.averageScore = Math.floor(statsClassic.score/statsClassic.count);
        statsClassic.averageTime = Utils.humanTime(statsClassic.time/statsClassic.count);
        statsClassic.time = Utils.humanTime(statsClassic.time);
        statsClassic.longest = Utils.humanTime(statsClassic.longest);
      }

      this.addTitle(i++, 'Classic Mode');
      _.forEach(statsClassic, bind(this, this.addStat, i, order));
      i += order.length;
      this.addTitle(i++, 'Time Mode');
      _.forEach(statsTime, bind(this, this.addStat, i, order));
      i += order.length;

      this.addTitle(i++, 'Tiles');
      _.forEach(tileKeys, bind(this, function(key) {
        this.addStat(i++, null, tiles[key], key);
      }));
    }));

    _.forEach(games, function(game) {
      var mode;
      if(game.mode === 'time') {
        mode = statsTime;
      } else {
        mode = statsClassic;
        mode.score += game.score;
        mode.highScore = Math.max(mode.highScore, game.score);
      }
      mode.count += 1;
      mode.time += game.time || 0;
      mode.longest = Math.max(mode.longest, game.time);
      if(!game.highestTile) {
        game.highestTile = 2;
      }
      mode.tile = game.highestTile > mode.tile ?  game.highestTile : mode.tile;
      tile[game.mode].push(game.highestTile);
      finish();
    });
  };

  this.addTitle = function(order, text) {
    var title = this.textPool.obtainView();
    title.updateOpts({
      visible: true,
      order: order
    });
    title.show();
    title.setText(text);
  };

  this.addStat = function(i, order, val, prop) {
    var stat = this.statView.obtainView();
    stat.updateOpts({
      superview: this,
      visible: true,
      order: order ? i + order.indexOf(prop): i
    });
    stat.key.updateOpts({
      text: strings[prop] || prop
    });
    stat.value.updateOpts({
      text: val
    });
  };
});
