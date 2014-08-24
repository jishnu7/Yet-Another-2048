/* jshint ignore:start */
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import src.gc.ScoreView as ScoreView;

import src.Utils as Utils;

/* jshint ignore:end */

exports = Class(ImageView, function(supr) {
  this.init = function(opts) {
    merge(opts, {
      anchorX: opts.width/2,
      anchorY: opts.height/2
    });
    supr(this, 'init', [opts]);

    this.text = new ScoreView({
      superview: this,
      layout: 'box',
      text: opts.value,
      width: opts.width,
      height: opts.height/3,
      centerY: true
    });
  };

  this.setValue = function(val) {
    var img = -1, i,
      opts= this._opts,
      text = this.text;

    // this is straightforward, tiles having value <8 have lighter background,
    // so those needs darker color for text, others need lighter color for text.
    if(val >= 8 && opts.color !== 1) {
      text.setCharacterData(Utils.colors.number);
      opts.color = 1;
    } else if(val < 8 && opts.color !== 0) {
      text.setCharacterData(Utils.colors.score);
      opts.color = 0;
    }
    text.setText(val);
    opts.value = val;

    // Find color for the tile, if not found use color for previous tile.
    for(i = val; img === -1 && i !== 1; i /= 2) {
      img = Utils.colors.tile.indexOf(i);
    }
    this.setImage(Utils.getImage('cell_' + i*2, true));
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
});
