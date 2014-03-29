exports = (function() {
  var history = {},
    stack = [];

  history.add = function(callback) {
    stack.push(callback);
  };

  history.release = function() {
    if(stack.length <= 0) {
      return false;
    } else {
      stack.pop()();
    }
  };

  return history;

}());
