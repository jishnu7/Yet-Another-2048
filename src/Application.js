/* jshint ignore:start */
import ui.View as View;
import ui.StackView as StackView;
import ui.TextView as TextView;
import ui.GestureView as GestureView;

import src.Grid as Grid;
import src.Cell as Cell;
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

    var grid = new Grid({
      superview: game
    });

    //for(var x=0; x<4; x++) {
      //for(var y=0; y<4; y++) {
        var cell = new Cell({
          superview: grid,
        });
      //}
    //}

    game.on('Swipe', function(angle, direction) {
      console.log('angle', angle, 'direction', direction);
      grid.moveCell(cell, direction);
    });

    this.call = function(dir) {
      grid.moveCell(cell, dir);
    };

    rootView.push(game);
  };

  this.launchUI = function () {};
});
