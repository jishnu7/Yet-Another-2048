/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;

import src.Utils as Utils;
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

    var container = new View({
      superview: this,
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      height: 400
    });
    this.addMenuEntry(container, 'Play');
    this.addMenuEntry(container, 'Sign In');
    this.addMenuEntry(container, 'How to Play');
  };

  this.addMenuEntry = function(superview, text) {
    var view = new TextView({
      superview: superview,
      centerX: true,
      width: 300,
      height: 100,
      size: 50,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.text,
      text: text
    });
    view.on('InputOut', bind(this, function() {
      this.emit(text.replace(/ /g, '-'));
    }));
  };

});
