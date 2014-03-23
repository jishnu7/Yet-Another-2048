/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;

import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    merge(opts, {
      inLayout: false,
      layout: 'linear',
      backgroundColor: Utils.colors.grid,
      zIndex: 2,
      opacity: 0.7,
      direction: 'vertical',
      justifyContent: 'center'
    });
    supr(this, 'init', [opts]);

    new TextView({
      superview: this,
      layout: 'box',
      centerX: true,
      width: 400,
      height: 50,
      inLayout: false,
      top: 50,
      text: 'Game Over!'
    });

    new TextView({
      superview: this,
      centerX: true,
      width: 400,
      height: 75,
      size: 50,
      backgroundColor: 'black',
      text: 'Play Again'
    });
  };

  this.show = function(opts) {
    opts.visible = true;
    this.updateOpts(opts);
  };

  this.hide = function() {
    this.style.visible = false;
  };

  this.onInputOut = function() {
    this.emit('Restart');
  };
});
