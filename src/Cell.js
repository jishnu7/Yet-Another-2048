/* jshint ignore:start */
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.resource.Image as Image;

import src.Utils as Utils;

/* jshint ignore:end */

exports = Class(ImageView, function(supr) {
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
      size: 56,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.number
    });
  };

  this.setValue = function(val) {
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
      img = -1, i;
      // this is straightforward, tiles having value <8 have lighter background,
      // so those needs darker color for text, others need lighter color for text.
      color = val >= 8 ? 1:0;

    // Find color for the tile, if not found use color for previous tile.
    for(i = val; img==-1 && i!==1; i/=2) {
      img = Utils.colors.tile.indexOf(i);
    }
    this.setImage('resources/images/cell_' + i*2 + '.png');

    this.text.updateOpts({color: Utils.colors.tile_text[color]});
  };
});
