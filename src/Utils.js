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

  obj.setTheme = function(theme) {
    theme = theme || Storage.getTheme();
    obj.theme = JSON.parse(CACHE['resources/themes/' + theme + '.json']);
    obj.theme.number = {
      '0': { 'image': 'resources/images/' + theme + '/number_0.png' },
      '1': { 'image': 'resources/images/' + theme + '/number_1.png' },
      '2': { 'image': 'resources/images/' + theme + '/number_2.png' },
      '3': { 'image': 'resources/images/' + theme + '/number_3.png' },
      '4': { 'image': 'resources/images/' + theme + '/number_4.png' },
      '5': { 'image': 'resources/images/' + theme + '/number_5.png' },
      '6': { 'image': 'resources/images/' + theme + '/number_6.png' },
      '7': { 'image': 'resources/images/' + theme + '/number_7.png' },
      '8': { 'image': 'resources/images/' + theme + '/number_8.png' },
      '9': { 'image': 'resources/images/' + theme + '/number_9.png' },
    };
    obj.theme.score = {
      '0': { 'image': 'resources/images/' + theme + '/score_0.png' },
      '1': { 'image': 'resources/images/' + theme + '/score_1.png' },
      '2': { 'image': 'resources/images/' + theme + '/score_2.png' },
      '3': { 'image': 'resources/images/' + theme + '/score_3.png' },
      '4': { 'image': 'resources/images/' + theme + '/score_4.png' },
      '5': { 'image': 'resources/images/' + theme + '/score_5.png' },
      '6': { 'image': 'resources/images/' + theme + '/score_6.png' },
      '7': { 'image': 'resources/images/' + theme + '/score_7.png' },
      '8': { 'image': 'resources/images/' + theme + '/score_8.png' },
      '9': { 'image': 'resources/images/' + theme + '/score_9.png' },
      ':': { 'image': 'resources/images/' + theme + '/score_colon.png' }
    };
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

  obj.getButtonImage = function(name, theme, select) {
    var path = '',
      images;

    if(theme) {
      path = Storage.getTheme() + '/';
    }

    if(select) {
      images = {
        selected: new Image({url: 'resources/images/' + path + 'btn_' + name + 'on.png'}),
        unselected: new Image({url: 'resources/images/btn_' + name + 'off.png'})
      };
    } else {
      images = {
        up: new Image({url: 'resources/images/' + path + 'btn_' + name + '.png'}),
        down: new Image({url: 'resources/images/btn_' + name + '_down.png'})
      };
    }
    return images;
  };

  obj.getImage = function(name, theme) {
    if(theme) {
      name = Storage.getTheme() + '/' + name;
    }
    return new Image({url: 'resources/images/' + name + '.png'});
  };

  obj.setTheme();
  return obj;
})();
