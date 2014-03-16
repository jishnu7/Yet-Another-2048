/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;
/* jshint ignore:end */

exports = Class(View, function(supr) {
  this.init = function(opts) {
    merge(opts, {
      backgroundColor: 'black'
    });
    supr(this, 'init', [opts]);

    this.text = new TextView({
      superview: this,
      layout: 'box',
      text: opts.value,
      color: 'white'
    });
  };

  this.setText = function(val) {
    this.text.setText(val);
  };

  this.getValue = function() {
    return this._opts.value;
  };

  this.setProperty = function(prop, val) {
    this._opts[prop] = val;
  };
});
