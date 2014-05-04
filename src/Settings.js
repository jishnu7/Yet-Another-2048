/* jshint ignore:start */
import ui.View as View;
import src.gc.ButtonView as ButtonView;
import src.PlayGame as PlayGame;

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
      order: 1,
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

    this.playButton = new ButtonView({
      superview: this,
      centerX: true,
      width: 362,
      height: 75,
      order: 2
    });

    this.update = bind(this, this.update);
  };

  this.toggleSound = function(bool) {
    this.setMuted(bool);
    localStorage.setItem('mute', bool);
  };

  this.update = function() {
    var opts;
    if(PlayGame.isLoggedIn()) {
      opts = {
        images: {
          up: 'resources/images/btn_signout.png',
          down: 'resources/images/btn_signout_down.png'
        },
        on: {
          up: bind(this, PlayGame.logout, this.update)
        }
      };
    } else {
      opts = {
        images: {
          up: 'resources/images/btn_signin.png',
          down: 'resources/images/btn_signin_down.png'
        },
        on: {
          up: bind(this, PlayGame.login, this.update)
        }
      };
    }
    this.playButton.updateOpts(opts);
    this.playButton.setState(ButtonView.states.UP);
    this.needsReflow();
  };
});
