/* jshint ignore:start */
import device;
import ui.View as View;
import ui.StackView as StackView;
import ui.TextView as TextView;
import ui.GestureView as GestureView;
import ui.widget.GridView as GridView;
/* jshint ignore:end */

exports = Class(GC.Application, function () {
  this.initUI = function () {
    var rootView = new StackView({
      superview: this,
      layout: "box",
      backgroundColor: 'white'
    });

    var game = new GestureView({
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'space-outside',
      layoutWidth: '100%',
      layoutHeight: '100%',
    });

    var score = new TextView({
      superview: game,
      layout: 'box',
      color: 'red',
      text: '2048',
      size: 30,
      height: 50,
    });

    game.on('Swipe', function(angle, direction) {
      console.log('angle', angle, 'direction', direction);
      move(direction);
    });

    var grid = new GridView({
      superview: game,
      layout: 'box',
      centerX: true,
      backgroundColor: 'red',
      width: device.width - 10,
      height: device.width - 10,
      rows: 4,
      cols: 4,
      horizontalMargin: 5,
      verticalMargin: 5,
    });
    //for(var x=0; x<4; x++) {
      //for(var y=0; y<4; y++) {
        var cell = new View({
          superview: grid,
          backgroundColor: 'black',
          col: 0,
          row: 0,
        });
      //}
    //}

    var horz = new View({
      superview: game,
      layout: 'linear',
      justifyContent: 'space-outside',
      height: 25,
      layoutWidth: '100%'
    });

    var move = function(direction) {
      switch (direction) {
        case 'left': x = -1; y = 0; break;
        case 'right': x = 1; y = 0; break;
        case 'up': x = 0; y = -1; break;
        case 'down': x = 0; y = 1; break;
        default: return;
      }

      var opts = cell._opts,
        col = opts.col,
        row = opts.row;

      col += x;
      col = col < grid.getCols() ? col : grid.getCols()-1;
      col = col < 0 ? 0 : col;

      row += y;
      row = row < grid.getRows() ? row : grid.getRows()-1;
      row = row < 0 ? 0 : row;

      console.log('move', row, col);
      opts.row = row;
      opts.col = col;
    };

    rootView.push(game);
  };
  
  this.launchUI = function () {};
});
