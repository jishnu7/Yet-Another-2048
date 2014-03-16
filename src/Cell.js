/* jshint ignore:start */
import ui.View as View;
/* jshint ignore:end */

exports = Class(View, function(supr) {
  this.init = function(opts) {
    merge(opts, {
      backgroundColor: 'black'
    });
    supr(this, 'init', [opts]);
  };

  this.setProperty = function(prop, val) {
    console.log('set property', prop, val);
    this._opts[prop] = val;
  };
});
