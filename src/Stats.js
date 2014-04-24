/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;
import src.gc.ButtonView as ButtonView;

import src.Utils as Utils;
import src.PlayGame as PlayGame;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      direction: 'vertical',
      layoutWidth: '100%',
      layoutHeight: '100%'
    });
    supr(this, 'init', [opts]);

    new TextView({
      superview: this,
      layout: 'box',
      centerX: true,
      layoutWidth: '90%',
      height: 50,
      text: 'Stats',
      size: 50,
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
  };
});
