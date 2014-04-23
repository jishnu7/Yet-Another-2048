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
      text.setCharacterData({
        '0': { 'image': 'resources/images/number_0.png' },
        '1': { 'image': 'resources/images/number_1.png' },
        '2': { 'image': 'resources/images/number_2.png' },
        '3': { 'image': 'resources/images/number_3.png' },
        '4': { 'image': 'resources/images/number_4.png' },
        '5': { 'image': 'resources/images/number_5.png' },
        '6': { 'image': 'resources/images/number_6.png' },
        '7': { 'image': 'resources/images/number_7.png' },
        '8': { 'image': 'resources/images/number_8.png' },
        '9': { 'image': 'resources/images/number_9.png' },
      });
      opts.color = 1;
    } else if(val < 8 && opts.color !== 0) {
      text.setCharacterData({
        '2': { image: 'resources/images/score_2.png' },
        '4': { image: 'resources/images/score_4.png' }
      });
      opts.color = 0;
    }
    text.setText(val);
    opts.value = val;

    // Find color for the tile, if not found use color for previous tile.
    for(i = val; img === -1 && i !== 1; i /= 2) {
      img = Utils.colors.tile.indexOf(i);
    }
    this.setImage('resources/images/cell_' + i*2 + '.png');
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
