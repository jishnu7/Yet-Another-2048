/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;

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

    // App logo
    new TextView({
      superview: this,
      centerX: true,
      width: 500,
      height: 300,
      size: 300,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.text,
      text: '2048'
    });

    this.menuContainer = new View({
      superview: this,
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      height: 400
    });
    this.addMenuEntry('Play', 1);
    this.signin = this.addMenuEntry('Sign In', 2);
    this.leaderboard = this.addMenuEntry('Leaderboard', 3);
    this.achievements = this.addMenuEntry('Achievements', 4);
    this.update();
    //this.addMenuEntry(container, 'How to Play');
  };

  this.update = function() {
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
