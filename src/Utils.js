/* jshint ignore:start */
import ui.resource.Image as Image;
import src.Storage as Storage;
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

  obj.setColors = function(theme) {
    theme = theme || Storage.getTheme();
    obj.colors = JSON.parse(CACHE['resources/themes/' + theme + '.json']);
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

  obj.getButtonImage = function(name) {
    return {
      up: new Image({url: 'resources/images/btn_' + name + '.png'}),
      down: new Image({url: 'resources/images/btn_' + name + '_down.png'}),
    };
  };

  obj.getImage = function(name, theme) {
    if(theme) {
      name = Storage.getTheme() + '/' + name;
    }
    return new Image({url: 'resources/images/' + name + '.png'});
  };

  obj.setColors();
  return obj;
})();
