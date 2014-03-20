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
      height: 50
    });
    supr(this, 'init', [opts]);

    this.scoreView = new TextView({
      superview: this,
      text: 0,
      size: 30,
      width: device.width/2,
      color: Utils.colors.text
    });
    this.score = 0;

    var hs = parseInt(localStorage.getItem('highscore'), 10) || 0;
    this.highScoreView = new TextView({
      superview: this,
      text: hs,
      size: 30,
      width: device.width/2,
      color: Utils.colors.text
    });
    this.highScore = hs;
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
