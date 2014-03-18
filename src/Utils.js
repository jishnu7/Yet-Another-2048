
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
    //text_bright: '#f9f6f2',
    tile_blank: '#CCC0B3',
    tile: {
        2: '#EEE4DA',
        4: '#EDE0C8',
        8: '#F2B179',
        16: '#F59563',
        32: '#F67C5F',
        64: '#F65E3B',
        128: '#EDCF72'
      },
    tile_text: {
        2: '#776E65',
        8: '#F9F6F2'
      },
    grid: '#BBADA0'
  };
  return obj;
}();
