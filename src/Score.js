/* jshint ignore:start */
import device;
import ui.View as View;
import ui.TextView as TextView;
import ui.ScoreView as ScoreView;
import util.underscore as _;

import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {
  var storageID = 'highscore',
    timerID,
    getID = function(mode) {
      return storageID + (mode === 'time' ? '_'+mode : '');
    },
    getHighScore = function(mode) {
      return parseInt(localStorage.getItem(getID(mode)), 10) || 0;
    };

  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      direction: 'horizontal',
      justifyContent: 'space-outside',
      height: 100,
      offsetY: -50
    });
    supr(this, 'init', [opts]);

    this.score = 0;
    this.highestTile = 0;
    this.highScore = 0;
    this.timer = 0;
    this._refresh = [];

    this.scoreView = this.createView('Score', 0, opts.width / 2);
    this.highScoreView = this.createView('Best', 0, opts.width / 2);
  };

  this.createView = function(name, value, width) {
    var scale = GC.app.tabletScale,
      container = new View({
        superview: this,
        layout: 'linear',
        direction: 'vertical',
        width: width,
        justifyContent: 'space-outside'
      }),
      label = new TextView({
        superview: container,
        layout: 'box',
        width: width,
        height: 30,
        text: name,
        size: 30 * scale,
        color: Utils.theme.text,
        fontFamily: Utils.fonts.text
      }),
      number = new ScoreView({
        superview: container,
        layout: 'box',
        width: width,
        height: 40 * scale,
        text: value,
        centerX: true,
        characterData: Utils.theme.score
      });

    this._refresh.push(label);
    this._refresh.push(number);

    return {
      setText: function(mode, value) {
        var out = '',
          h, m;
        if(mode === 'time') {
          h = Math.floor(value/3600);
          if(h > 0) {
            out += h + ':';
          }
          value %= 3600;
          m = Math.floor(value/60);
          if(m/10 < 1) {
            m = '0' + m;
          }
          out += m + ':';
          value %= 60;
          if(value/10 < 1) {
            value = '0' + value;
          }
          out += value;
        } else {
          out = value;
        }
        number.setText(out);
      },
      setLabel: function(name) {
        label.setText(name);
      }
    };
  };

  this.setMode = function(mode) {
    this.mode = mode;

    if(mode === 'time') {
      this.scoreView.setLabel('Time');
    } else {
      this.scoreView.setLabel('Score');
    }

    this.timer = 0;
    this.setHighScore();
  };

  this.reset = function() {
    this.timer = 0;
    this.score = 0;
    this.scoreView.setText(this.mode, 0);
    this.highestTile = 0;
  };

  this.update = function(val) {
    if(this.mode !== 'time') {
      this.setScore(this.score + val);
    }
    this.highestTile = val > this.highestTile ? val : this.highestTile;
  };

  this.setScore = function(score) {
    this.score = score;
    this.scoreView.setText(this.mode, score);
    if(score > this.highScore) {
      this.setHighScore(score);
    }
  };

  this.setHighScore = function(score) {
    score = score || getHighScore(this.mode);
    this.highScore = score;
    this.highScoreView.setText(this.mode, score);
  };

  this.saveHighScore = function() {
    localStorage.setItem(getID(this.mode), this.highScore);
  };

  this.load = function(score, highestTile, timer) {
    this.highestTile = parseInt(highestTile, 10);
    this.timer = timer;
    this.setScore(parseInt(score, 10));
  };

  this.stop = function() {
    clearInterval(timerID);
  };

  this.start = function() {
    var update = (this.mode === 'time');
    timerID = setInterval(bind(this, function() {
      this.timer++;
      if(update) {
        this.setScore(this.score + 1);
      }
    }), 1000);
  };

  this.refresh = function () {
    _.each(this._refresh, function (view) {
      if (view instanceof ScoreView) {
        view.setCharacterData(Utils.theme.score);
        view.setText('');
      } else {
        view.updateOpts({
          color: Utils.theme.text
        });
      }
    });
  };
});
