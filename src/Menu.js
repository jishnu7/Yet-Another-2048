/* jshint ignore:start */
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import src.gc.ButtonView as ButtonView;

import src.PlayGame as PlayGame;
import src.Storage as Storage;
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

    var logo = new Image({url: 'resources/images/logo.png'});
    new ImageView({
      superview: this,
      centerX: true,
      width: logo.getWidth(),
      height: logo.getHeight(),
      image: logo
    });

    this.menuContainer = new View({
      superview: this,
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      height: 550
    });

    this.continue = this.addMenuEntry('continue', 1);
    this.addMenuEntry('new', 2);
    this.addMenuEntry('time', 3);
    this.signin = this.addMenuEntry('signin', 4);
    this.addMenuEntry('stats', 5);
    this.addMenuEntry('settings', 6);

    this.updateLogin();
    this.refresh();
  };

  this.refresh = function() {
    var fn = Storage.getGame() ? 'show' : 'hide';
    this.continue[fn]();
    this.menuContainer.needsReflow();
  };

  this.updateLogin = function() {
    if(PlayGame.isLoggedIn()) {
      this.signin.hide();
    } else {
      this.signin.show();
    }
    this.menuContainer.needsReflow();
  };

  this.addMenuEntry = function(text, order) {
    return new ButtonView({
      superview: this.menuContainer,
      centerX: true,
      width: 362,
      height: 75,
      bottom: 15,
      order: order,
      images: {
        up: 'resources/images/btn_' + text + '.png',
        down: 'resources/images/btn_' + text + '_down.png'
      },
      on: {
        up: bind(this, function() {
          this.emit(text);
        })
      }
    });
  };

});
