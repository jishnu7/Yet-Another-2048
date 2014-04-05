
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
    background: '#F6F6F6',
    text: '#657277',
    text_bright: '#FFFFFF',
    grid: '#BCBCBC',
    tile: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048,
      4096, 8192, 16384, 32768, 65536],
    tile_text: ['#657277', '#F9F6F2']
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
