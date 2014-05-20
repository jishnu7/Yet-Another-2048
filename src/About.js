/* jshint ignore:start */
import ui.View as View;
import ui.TextView as TextView;
import src.Utils as Utils;
/* jshint ignore:end */

exports = Class(View, function(supr) {
  this.init = function(opts) {
    merge(opts, {
      layout: 'linear',
      direction: 'vertical',
      justifyContent: 'center'
    });
    supr(this, 'init', [opts]);

    this.addTitle('Yet Another 2048 v1.1');
    this.addTextArea(
      'This game is based on 2048 by Gabriele Cirulli, ' +
      'which is based on 1024 by Veewo Studio and Threes by Asher Vollmer. ' +
      'We are using images from The Noun Project and ' +
      'Open Source code from Game Closure Devkit. ' +
      'The source and detailed credits are available in ' +
      'http://github.com/jishnu7/yet-another-2048'
    );
    this.addTitle('Thanks');
    this.addTextArea(
      'Aiswarya, Akhil, Aswathy, Jibin, Jithesh, ' +
      'Maheswaran, Sabarish, Sundar, Tijin, ' +
      'Members of G+ beta test group, people from #gamedev-india, ' +
      'and everyone who beta tested.'
    );
  };

  this.addTitle = function(text) {
    new TextView({
      superview: this,
      layout: 'box',
      horizontalAlign: 'center',
      layoutWidth: '100%',
      height: 90,
      size: 45 * GC.app.tabletScale,
      color: Utils.colors.text,
      fontFamily: Utils.fonts.text,
      text: text
    });
  };

  this.addTextArea = function(text) {
    new TextView({
      superview: this,
      color: Utils.colors.text,
      horizontalAlign: 'center',
      size: 25 * GC.app.tabletScale,
      fontFamily: Utils.fonts.number,
      width: this._opts.width,
      layoutWidth: '100%',
      height: 100,
      padding: '0 100',
      text: text,
      wrap: true,
      autoSize: true
    });
  };
});
