/* jshint ignore:start */
import device;
import ui.View as View;
import ui.TextView as TextView;

import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {
  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      justifyContent: 'space-outside',
      height: 100
    });
    supr(this, 'init', [opts]);

    this.scoreView = this.createView('Score', 0);
    this.score = 0;

    var hs = this.highScore = parseInt(localStorage.getItem('highscore'), 10) || 0;
    this.highScoreView = this.createView('Best', hs);
  };

  this.createView = function(name, value) {
    var container = new View({
      superview: this,
      layout: 'linear',
      direction: 'vertical',
      layoutWidth: '30%',
      justifyContent: 'space-outside',
      backgroundColor: Utils.colors.tile_blank,
    });
    new TextView({
      superview: container,
      layout: 'box',
      height: 30,
      text: name,
      size: 30,
      color: Utils.colors.text_score,
      fontFamily: Utils.fonts.text
    });
    if(typeof value !== 'undefined') {
      return new TextView({
        superview: container,
        layout: 'box',
        height: 50,
        text: value,
        size: 30,
        color: Utils.colors.background,
        fontFamily: Utils.fonts.number
      });
    } else {
      return container;
    }
  };

  this.reset = function() {
    this.score = 0;
    this.scoreView.setText(0);
  };

  this.update = function(val) {
    this.score += val;
    this.scoreView.setText(this.score);
    this.setHighScore();
  };

  this.setHighScore = function() {
    var hs = this.highScore,
      score = this.score;
    if(score > hs) {
      this.highScore = score;
      this.highScoreView.setText(score);
      localStorage.setItem('highscore', score);
    }
  };
});
