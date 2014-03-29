exports = (function() {
  var history = {},
    stack = [],
    count = 0;

  history.add = function(callback) {
    count = 0;
    stack.push(callback);
  };

  history.release = function() {
    if(stack.length <= 0) {
      // return false to close the app
      return (count > 0 ? false: ++count);
    } else {
      stack.pop()();
    }
  };

  return history;

}());
