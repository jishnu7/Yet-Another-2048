/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;

import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {

  this.init = function(opts) {
    supr(this, 'init', [opts]);
  };

});
