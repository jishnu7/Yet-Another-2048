/* jshint ignore:start */
import ui.View as View;
import src.gc.Toast as Toast;
import src.gc.ButtonView as ButtonView;
import googleAnalytics as Analytics;

import src.PlayGame as PlayGame;
import src.Storage as Storage;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    var audio = opts.audio,
      states = ButtonView.states,
      img_sound = Utils.getButtonImage('sound', true, true),
      img_tut = Utils.getButtonImage('tutorial', true, true),
      img_theme = Utils.getButtonImage('theme', false, true),
      img_about = Utils.getButtonImage('about', true),
      btn_width = img_sound.selected.getWidth(),
      btn_height = img_sound.selected.getHeight();

    merge(opts, {
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      layoutWidth: '100%',
      layoutHeight: '100%',
      scale: GC.app.tabletScale
    });
    supr(this, 'init', [opts]);

    new ButtonView({
      superview: this,
      centerX: true,
      width: btn_width,
      height: btn_height,
      bottom: 30,
      toggleSelected: true,
      order: 1,
      images: img_sound,
      on: {
        selected: bind(audio, this.toggleSound, false),
        unselected: bind(audio, this.toggleSound, true)
      }
    }).setState(
      audio.getMuted() ? states.UNSELECTED : states.SELECTED
    );

    new ButtonView({
      superview: this,
      layout: 'box',
      centerX: true,
      width: btn_width,
      height: btn_height,
      bottom: 30,
      toggleSelected: true,
      order: 2,
      images: img_tut,
      on: {
        selected: function() {
          Storage.resetTutorial();
          Analytics.track('tutorial', {show: true});
        },
        unselected: function() {
          Storage.setTutorialCompleted();
          Analytics.track('tutorial', {hide: true});
        }
      }
    }).setState(
      Storage.isTutorialCompleted() ? states.UNSELECTED : states.SELECTED
    );

    this.playButton = new ButtonView({
      superview: this,
      centerX: true,
      width: btn_width,
      height: btn_height,
      order: 3,
      bottom: 30
    });

    new ButtonView({
      superview: this,
      layout: 'box',
      centerX: true,
      width: btn_width,
      height: btn_height,
      bottom: 30,
      toggleSelected: true,
      order: 4,
      images: img_theme,
      on: {
        selected: bind(this, this.setTheme, 'default'),
        unselected: bind(this, this.setTheme, 'dark')
      }
    }).setState(
      Storage.getTheme() === 'default' ? states.SELECTED : states.UNSELECTED
    );

    new ButtonView({
      superview: this,
      layout: 'box',
      centerX: true,
      width: btn_width,
      height: btn_height,
      order: 5,
      images: img_about,
      on: {
        up: bind(this, this.emit, 'about')
      }
    });

    this.update = bind(this, this.update);
  };

  this.toggleSound = function(bool) {
    this.setMuted(bool);
    localStorage.setItem('mute', bool);
    var evnt = {};
    evnt[bool] = true;
    Analytics.track('audio', evnt);
  };

  this.setTheme = function(theme) {
    var toast = this.toast;

    Utils.setTheme(theme);
    Storage.setTheme(theme);

    if(!toast) {
      toast = this.toast = new Toast({
        superview: this,
        inLayout: false,
        width: 500,
        centerX: true,
        position: 'bottom',
        images: {
          bottom: Utils.getImage('toast'),
        },
        text: {
          color: '#fff',
          size: 32,
          fontFamily: Utils.fonts.text
        },
      });
    }
    toast.pop('Restart the app to get the new theme.');
  };

  this.update = function() {
    var opts;
    if(PlayGame.isLoggedIn()) {
      opts = {
        images: Utils.getButtonImage('signout', true),
        on: {
          up: bind(this, PlayGame.logout, this.update)
        }
      };
    } else {
      opts = {
        images: Utils.getButtonImage('signin'),
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
