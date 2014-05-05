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
      averageTile: 'Average tile'
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
        modeMap[el] = modeMap[el] ? 1 : modeMap[el] + 1;
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
      top: 50,
      order: 1
    });

    var containerPlay = new View({
      superview: this,
      layout: 'linear',
      justifyContent: 'space',
      layoutWidth: '90%',
      height: 80,
      centerX: true,
      top: 50,
      order: 2
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

    this.textPool = new ViewPool({
      ctor: TextView,
      initCount: 4,
      initOpts: {
        superview: this,
        layout: 'box',
        centerX: true,
        width: opts.width - 100,
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
          layoutWidth: '30%',
          color: Utils.colors.text,
          size: 35,
          fontFamily: Utils.fonts.number,
          horizontalAlign: 'left'
        });

        this.value = new TextView({
          superview: this,
          layout: 'box',
          layoutWidth: '30%',
          size: 35,
          color: Utils.colors.text,
          fontFamily: Utils.fonts.number,
          horizontalAlign: 'right'
        });
      };
    });

    this.statView = new ViewPool({
      ctor: statView,
      initCount: 15,
      initOpts: {
        width: opts.width - 150,
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
      statsTime = {
        count: 0,
        time: 0,
        tile: 0,
        averageTile: 0
      },
      statsClassic = {
        count: 0,
        score: 0,
        time: 0,
        tile: 0,
        averageTile: 0
      },
      tile = {
        time: [],
        classic: []
      };

    var finish = Utils.finish(_.keys(games).length, bind(this, function() {
      statsTime.averageTile = getMode(tile.time);
      statsClassic.averageTile = getMode(tile.classic);
      statsTime.time = Utils.humanTime(statsTime.time);
      statsClassic.time = Utils.humanTime(statsClassic.time);

      this.addTitle(i++, 'Classic Mode');
      _.forEach(statsClassic, bind(this, this.addStat, i++));
      this.addTitle(i++, 'Time Mode');
      _.forEach(statsTime, bind(this, this.addStat, i++));

      this.addTitle(i++, 'Tiles');
      _.forEach(tileKeys, bind(this, function(key) {
        this.addStat(i++, tiles[key], key);
      }));
    }));

    _.forEach(games, function(game) {
      var mode;
      if(game.mode === 'time') {
        mode = statsTime;
      } else {
        mode = statsClassic;
        statsClassic.score += game.score;
      }
      mode.count += 1;
      mode.time += game.time || 0;
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

  this.addStat = function(order, val, prop) {
    var stat = this.statView.obtainView();
    stat.updateOpts({
      superview: this,
      visible: true,
      order: order
    });
    stat.key.updateOpts({
      text: strings[prop] || prop
    });
    stat.value.updateOpts({
      text: val
    });
  };
});
