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
      justifyContent: 'center',
      layoutWidth: '100%',
      layoutHeight: '100%'
    });
    supr(this, 'init', [opts]);

    this.addMenuEntry('Play');
    this.addMenuEntry('Sign In');
    this.addMenuEntry('How to Play');
  };

  this.addMenuEntry = function(text) {
    var view = new TextView({
      superview: this,
      centerX: true,
      width: 300,
      height: 100,
      size: 50,
      color: Utils.colors.text,
      text: text
    });
    view.on('InputOut', bind(this, function() {
      this.emit(text.replace(/ /g, '-'));
    }));
  };

});
