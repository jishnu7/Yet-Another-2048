
exports = (function() {
  var prevGameID = 'prev_game';

  return {
    // Function to save the game to local storage
    saveGame: function(data) {
      localStorage.setItem(prevGameID, JSON.stringify(data));
    },
    getGame: function() {
      return JSON.parse(localStorage.getItem(prevGameID));
    },
    deleteGame: function() {
      localStorage.removeItem(prevGameID);
    }
  };
})();
