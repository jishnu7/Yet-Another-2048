/* jshint ignore:start */
import device;
import ui.View as View;
import ui.TextView as TextView;
import ui.ScoreView as ScoreView;

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
    },
    characterData = {
      "0": { "image": "resources/images/score/0.png" },
      "1": { "image": "resources/images/score/1.png" },
      "2": { "image": "resources/images/score/2.png" },
      "3": { "image": "resources/images/score/3.png" },
      "4": { "image": "resources/images/score/4.png" },
      "5": { "image": "resources/images/score/5.png" },
      "6": { "image": "resources/images/score/6.png" },
      "7": { "image": "resources/images/score/7.png" },
      "8": { "image": "resources/images/score/8.png" },
      "9": { "image": "resources/images/score/9.png" },
      ":": { "image": "resources/images/score/colon.png" }
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
      justifyContent: 'center',
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
      height: 50,
      text: value,
      size: 60,
      centerX: true,
      characterData: characterData
    });
    return {
      setText: function(mode, value) {
        var out = '';
        if(mode === 'time') {
          out += Math.floor(value/3600); value %= 3600;
          out += ':' + Math.floor(value/60); value %= 60;
          out += ':' + value;
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
    var score = this.score;
    score += (val || 1);
    this.setScore(score);

    if(score > this.highScore) {
      this.setHighScore(score);
    }

    this.highestTile = val > this.highestTile ? val : this.highestTile;
  };

  this.setScore = function(score) {
    this.score = score;
    this.scoreView.setText(this.mode, score);
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
        this.update();
      }
    }), 1000);
  };
});
