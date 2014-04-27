/* jshint ignore:start */
import ui.View as View;
import src.gc.ButtonView as ButtonView;
import src.PlayGame as PlayGame;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    var audio = opts.audio,
      states = ButtonView.states;

    merge(opts, {
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      layoutWidth: '100%',
      layoutHeight: '100%'
    });
    supr(this, 'init', [opts]);

    new ButtonView({
      superview: this,
      centerX: true,
      width: 362,
      height: 75,
      bottom: 30,
      toggleSelected: true,
      images: {
        selected: 'resources/images/btn_soundon.png',
        unselected: 'resources/images/btn_soundoff.png'
      },
      on: {
        selected: bind(audio, this.toggleSound, false),
        unselected: bind(audio, this.toggleSound, true)
      }
    }).setState(
      audio.getMuted() ? states.UNSELECTED : states.SELECTED
    );

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

  this.toggleSound = function(bool) {
    this.setMuted(bool);
    localStorage.setItem('mute', bool);
  };

});
