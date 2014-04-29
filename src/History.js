exports = (function() {
  var history = {},
    stack = [],
    busy = false;

  history.add = function(callback, view) {
    stack.push(callback);

    if(view) {
      // flag to disable backbutton while view is being rendered
      busy = true;
      var listner = function() {
        busy = false;
        view.removeListener('ViewDidAppear', listner);
      };
      view.on('ViewDidAppear', listner);
    }
  };

  history.release = function() {
    if(!busy) {
      if(stack.length <= 0) {
        return false;
      } else {
        stack.pop()();
      }
    }
  };

  return history;

}());
