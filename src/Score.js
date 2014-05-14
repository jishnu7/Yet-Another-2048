/* jshint ignore:start */
import device;
import ui.View as View;
import ui.TextView as TextView;
import ui.ScoreView as ScoreView;

import src.Utils as Utils;
import src.PlayGame as PlayGame;
/* jshint ignore:end */

exports = Class(View, function(supr) {
  var storageID = 'highscore',
    timerID,
    getID = function(mode) {
      return storageID + (mode === 'time' ? '_'+mode : '');
    },
    getHighScore = function(mode) {
      return parseInt(localStorage.getItem(getID(mode)), 10) || 0;
    },
    characterData = {
      '0': { 'image': 'resources/images/score_0.png' },
      '1': { 'image': 'resources/images/score_1.png' },
      '2': { 'image': 'resources/images/score_2.png' },
      '3': { 'image': 'resources/images/score_3.png' },
      '4': { 'image': 'resources/images/score_4.png' },
      '5': { 'image': 'resources/images/score_5.png' },
      '6': { 'image': 'resources/images/score_6.png' },
      '7': { 'image': 'resources/images/score_7.png' },
      '8': { 'image': 'resources/images/score_8.png' },
      '9': { 'image': 'resources/images/score_9.png' },
      ':': { 'image': 'resources/images/score_colon.png' }
    };

  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      justifyContent: 'space-outside',
      height: 100,
      offsetY: -50
    });
    supr(this, 'init', [opts]);

    this.score = 0;
    this.highestTile = 0;
    this.highScore = 0;
    this.timer = 0;

    this.scoreView = this.createView('Score', 0);
    this.highScoreView = this.createView('Best', 0);
  };

  this.createView = function(name, value) {
    var container = new View({
      superview: this,
      layout: 'linear',
      direction: 'vertical',
      layoutWidth: '50%',
      justifyContent: 'space-outside',
    }),
    label = new TextView({
      superview: container,
      layout: 'box',
      height: 30,
      text: name,
      size: 30,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.text
    }),
    number = new ScoreView({
      superview: container,
      layout: 'box',
      height: 40,
      text: value,
      centerX: true,
      characterData: characterData
    });
    return {
      setText: function(mode, value) {
        var out = '',
          h, m;
        if(mode === 'time') {
          PlayGame.achievement(value, mode);
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
});
