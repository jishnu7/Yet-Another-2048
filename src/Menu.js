/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;

import src.Utils as Utils;
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
      justifyContent: 'center',
      height: 400
    });
    this.continue = this.addMenuEntry('Continue', 1);
    this.play = this.addMenuEntry('New Game', 2);
    this.signin = this.addMenuEntry('Sign In', 3);
    this.leaderboard = this.addMenuEntry('Leaderboard', 4);
    this.achievements = this.addMenuEntry('Achievements', 5);
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
      this.signin.updateOpts({
        text: 'Sign Out',
        order: 5
      });
    } else {
      this.leaderboard.hide();
      this.achievements.hide();
      this.signin.updateOpts({
        text: 'Sign In',
        order: 2
      });
    }
    this.menuContainer.needsReflow();
  };

  this.addMenuEntry = function(text, order) {
    var view = new TextView({
      superview: this.menuContainer,
      centerX: true,
      width: 300,
      height: 100,
      size: 50,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.text,
      text: text,
      order: order
    });
    view.on('InputOut', bind(this, function() {
      this.emit(view.getText().replace(/ /g, '-'));
    }));
    return view;
  };

});
