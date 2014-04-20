/* jshint ignore:start */
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
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
    this.game = opts.game;

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
      justifyContent: 'space',
      height: 400
    });
    this.continue = this.addMenuEntry('continue', 1);
    this.addMenuEntry('new', 2);
    this.addMenuEntry('time', 3);
    this.addMenuEntry('stats', 7);

    this.signin = this.addMenuEntry('signin', 4);
    this.signout = this.addMenuEntry('signout', 7);

    this.leaderboard = this.addMenuEntry('leaderboard', 5);
    this.achievements = this.addMenuEntry('achievements', 6);
    this.updateLogin();
    this.refresh();
    //this.addMenuEntry(container, 'How to Play');
  };

  this.refresh = function() {
    if(this.game.getGameState() === 'ongoing') {
      this.continue.show();
    } else {
      this.continue.hide();
    }
    this.menuContainer.needsReflow();
  };

  this.updateLogin = function() {
    if(PlayGame.isLoggedIn()) {
      this.leaderboard.show();
      this.achievements.show();
      this.signin.hide();
      this.signout.show();
    } else {
      this.leaderboard.hide();
      this.achievements.hide();
      this.signin.show();
      this.signout.hide();
    }
    this.menuContainer.needsReflow();
  };

  this.addMenuEntry = function(text, order) {
    var view = new ButtonView({
      superview: this.menuContainer,
      centerX: true,
      width: 290,
      height: 60,
      size: 50,
      order: order,
      images: {
        up: 'resources/images/btn_' + text + '.png',
        down: 'resources/images/btn_' + text + '_down.png'
      }
    });
    view.on('InputOut', bind(this, function() {
      this.emit(text);
    }));
    return view;
  };

});
