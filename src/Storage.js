
exports = (function() {
  return {
    // Function to save the game to local storage
    saveGame: function(data) {
      localStorage.setItem('prev_game', JSON.stringify(data));
    },
    getGame: function() {
      return JSON.parse(localStorage.getItem('prev_game'));
    },
    deleteGame: function() {
      localStorage.removeItem('prev_game');
    }
  };
})();
