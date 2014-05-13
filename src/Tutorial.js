/* jshint ignore:start */
import animate;
import ui.TextView as TextView;

import src.Storage as Storage;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(TextView, function(supr) {
  var head = 0,
    strings = [
      'Swipe to merge cells',
      'There is a catch, only cells with same number will merge',
      'Score your highest by attaining a tile with 2048 or more',
      'Sign-in with your Google account to compare score with your friends',
    ],
    busy = false;

  this.init = function(opts) {
    merge(opts, {
      layout: 'box',
      size: 32,
      centerX: true,
      height: 10,
      autoFontSize: false,
      wrap: true,
      padding: '100 100',
      offsetY: 75,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.number
    });
    supr(this, 'init', [opts]);
  };

  this.swipe = function() {
    if(!Storage.isTutorialCompleted() && !busy) {
      head++;
      var anim = animate(this);
      anim.now(function() {
        busy = true;
      }, 0).
      then({
        x: -this._opts.width,
        opacity: 0
      }, 1000).then(this.show, 0);
    }
  };

  this.start = function() {
    if(!Storage.isTutorialCompleted()) {
      this.show();
    } else {
      this.updateOpts({
        visible: false
      });
    }
  };

  this.show = function() {
    if(head >= strings.length) {
      Storage.setTutorialCompleted();
      this.updateOpts({
        visible: false
      });
      return;
    }

    var anim = animate(this);
    anim.now({
      x: this._opts.width*2,
      opacity: 0
    }, 0).then(function() {
      busy = true;
    }, 0).
    then({
      x: 0,
      opacity: 1
    }, 1000).then(function() {
      busy = false;
    }, 0);
    this.setText(strings[head]);
  };
});
