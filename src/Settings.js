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
      images: {
        up: 'resources/images/btn_signout.png',
        down: 'resources/images/btn_signout_downn.png'
      },
      on: {
        up: PlayGame.logout
      }
    });
  };
});
