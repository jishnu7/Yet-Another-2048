/* jshint ignore:start */
import ui.View as View;
import src.gc.ButtonView as ButtonView;

import src.PlayGame as PlayGame;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'space-outside',
      layoutWidth: '100%',
      layoutHeight: '100%'
    });
    supr(this, 'init', [opts]);

    new ButtonView({
      superview: this,
      centerX: true,
      width: 362,
      height: 75,
      bottom: 15,
      images: {
        up: 'resources/images/btn_achievements.png',
        down: 'resources/images/btn_achievements_down.png'
      },
      on: {
        up: PlayGame.showLeaderBoard
      }
    });

    new ButtonView({
      superview: this,
      centerX: true,
      width: 362,
      height: 75,
      bottom: 15,
      images: {
        up: 'resources/images/btn_leaderboard.png',
        down: 'resources/images/btn_leaderboard_down.png'
      },
      on: {
        up: PlayGame.showAchievements
      }
    });
  };
});
