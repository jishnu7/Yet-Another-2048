
exports = function() {
  var obj = {};
  obj.getVector = function(direction) {
    return {
      left: { col: -1, row: 0 },
      right: { col: 1,  row: 0 },
      up: { col: 0,  row: -1 },
      down: { col: 0,  row: 1 }
    }[direction];
  };

  obj.colors = {
    background: '#FAF8EF',
    text: '#776E65',
    text_bright: '#FFFFFF',
    grid: '#BCBCBC',
    tile_blank: '#C9C9C9',
    tile: {
        2: '#E9E9E9',
        4: '#d4ecf4',
        8: '#f1d39c',
        16: '#eedd52',
        32: '#aee239',
        64: '#6be8e6',
        128: '#ff6b6b',
        256: '#3299bb',
        512: '#ff9900',
        1024: '#ff4e7a',
        2048: '#ab526b',
      },
    tile_text: {
        2: '#424242',
        8: '#F9F6F2'
      }
  };

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

  return obj;
}();
