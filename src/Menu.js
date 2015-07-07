/* jshint ignore:start */
import ui.View as View;
import ui.ImageView as ImageView;
import ui.resource.Image as Image;
import src.gc.ButtonView as ButtonView;

import src.PlayGame as PlayGame;
import src.Storage as Storage;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'space-outside'
    });
    supr(this, 'init', [opts]);

    var logo = Utils.getImage('logo'),
      scale = GC.app.tabletScale;

    new ImageView({
      superview: this,
      layout: 'box',
      centerX: true,
      width: logo.getWidth(),
      height: logo.getHeight(),
      image: logo,
      scale: scale
    });

    this.menuContainer = new View({
      superview: this,
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center',
      width: opts.width,
      height: 450,
      scale: scale,
      centerAnchor: true
    });

    this.continue = this.addMenuEntry('continue', 1);
    this.addMenuEntry('new', 2);
    this.addMenuEntry('time', 3);
    this.addMenuEntry('stats', 4);
    this.addMenuEntry('settings', 5);

    this.refresh();
  };

  this.refresh = function() {
    var fn = Storage.getGame() ? 'show' : 'hide';
    this.continue[fn]();
    this.menuContainer.needsReflow();
  };

  this.addMenuEntry = function(text, order) {
    var img = Utils.getButtonImage(text, true);
    return new ButtonView({
      superview: this.menuContainer,
      layout: 'box',
      centerX: true,
      images: img,
      width: img.up.getWidth(),
      height: img.up.getHeight(),
      bottom: 15,
      order: order,
      on: {
        up: bind(this, function() {
          this.emit(text);
        })
      }
    });
  };

});
