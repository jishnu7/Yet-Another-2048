/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;

import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {
  this.init = function(opts) {
    merge(opts, {
      anchorX: opts.width/2,
      anchorY: opts.height/2
    });
    supr(this, 'init', [opts]);

    this.text = new TextView({
      superview: this,
      layout: 'box',
      text: opts.value,
      size: 60,
      color: Utils.colors.text
    });
    this.setColor();
  };

  this.setVal = function(val) {
    this._opts.value = val;
    this.text.setText(val);
    this.setColor();
  };

  this.getValue = function() {
    return this._opts.value;
  };

  this.setProperty = function(prop, val) {
    this._opts[prop] = val;
  };

  this.getRow = function() {
    return this._opts.row;
  };

  this.getCol = function() {
    return this._opts.col;
  };

  this.setColor = function() {
    var val = this.getValue(),
      color_bg, color_text,
      i, j;

    for(i = val; typeof color_bg === 'undefined' && i!==1; i/=2) {
      color_bg = Utils.colors.tile[i];
    }
    for(i = val; typeof color_text === 'undefined' && i!==1; i/=2) {
      color_text = Utils.colors.tile_text[i];
    }
    this.updateOpts({backgroundColor: color_bg});
    this.text.updateOpts({color: color_text});
  };
});
