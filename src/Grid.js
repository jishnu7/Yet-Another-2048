/* jshint ignore:start */
import animate;
import device;
import ui.widget.GridView as GridView;
/* jshint ignore:end */

exports = Class(GridView, function(supr) {
  this.init = function(opts) {
    merge(opts, {
      layout: 'box',
      centerX: true,
      backgroundColor: 'red',
      width: device.width - 10,
      height: device.width - 10,
      rows: 4,
      cols: 4,
      horizontalMargin: 5,
      verticalMargin: 5
    });
    supr(this, 'init', [opts]);
  };

  this.moveCell = function(cell, direction) {
    var x=0, y = 0;
    switch (direction) {
      case 'left':
      case 'right': x = 2; y = 0; break;
      case 'up':
      case 'down': x = 0; y = 1; break;
      default: return;
    }

    var opts = cell._opts,
      col = opts.col,
      row = opts.row,
      anim = animate(cell),
      dir = (direction === 'left' || direction === 'up' ? -1:1);

    var setter = function(prop, value) {
      cell.setProperty('col', col);
    };

    col += x * dir;
    col = col < this.getCols() ? col : this.getCols()-1;
    col = col < 0 ? 0 : col;
    console.log('move: col', col, opts.col, opts.row);

    if(col !== opts.col) {
      anim.then({
        x: this._colInfo[col].pos
      }, 100, animate.linear);
      anim.then(bind(this, setter, 'col', col));
    }

    row += y * dir;
    row = row < this.getRows() ? row : this.getRows()-1;
    row = row < 0 ? 0 : row;
    console.log('move: row', row);
    if(row !== opts.row) {
      anim.then({
        y: this._rowInfo[row].pos
      }, 100, animate.linear);
      anim.then(bind(cell, setter, 'row', row));
    }
  };
});
