/* jshint ignore:start */
import ui.resource.Image as Image;
/* jshint ignore:end */

exports = (function() {
  var obj = {};

  // Function to get vector of swipe operation
  obj.getVector = function(direction) {
    return {
      left: { col: -1, row: 0 },
      right: { col: 1,  row: 0 },
      up: { col: 0,  row: -1 },
      down: { col: 0,  row: 1 }
    }[direction];
  };

  obj.colors = {
    background: '#F6F6F6',
    text: '#657277',
    text_bright: '#FFFFFF',
    grid: '#BCBCBC',
    // These are the tiles we support.
    // An image with cell_<value>.png need to be there in
    // resources/images/ folder
    tile: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048,
      4096, 8192, 16384, 32768, 65536],
    tile_text: ['#657277', '#F9F6F2']
  };

  // Helper function to make sure that all required operations are
  // done before next operation.
  // Second parameter cb will be called only after calling this function
  // `count` number of times.
  obj.finish = function(count, cb) {
    return function() {
      count --;
      if(count === 0) {
        cb();
      }
    };
  };

  obj.fonts = {
    number: 'Signika-Light',
    text: 'Raleway-ExtraLight'
  };

  obj.humanTime = function(seconds) {
    var out = '', h, m;
    h = Math.floor(seconds/3600);
    if(h>0) {
      out += h + 'h ';
    }
    seconds %= 3600;
    m = Math.floor(seconds/60);
    out += m + 'm ';
    seconds %= 60;
    out += Math.floor(seconds) + 's' ;
    return out;
  };

  obj.getImage = function(name, button) {
    if(button) {
      return {
        up: new Image({url: 'resources/images/btn_' + name + '.png'}),
        down: new Image({url: 'resources/images/btn_' + name + '_down.png'}),
      };
    }
    return new Image({url: 'resources/images/' + name + '.png'});
  };

  return obj;
})();
