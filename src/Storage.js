
exports = (function() {
  var prevGameID = 'prev_game',
    statsID = 'stats_tile',
    saveData = function(id, data) {
      localStorage.setItem(id, JSON.stringify(data));
    },
    getData = function(id) {
      return JSON.parse(localStorage.getItem(id));
    };

  return {
    // Function to save the game to local storage
    saveGame: function(data) {
      saveData(prevGameID, data);
    },
    getGame: function() {
      return getData(prevGameID);
    },
    deleteGame: function() {
      localStorage.removeItem(prevGameID);
    },

    getTileStats: function() {
      return getData(statsID) || {};
    },
    saveTileStats: function(tile) {
      var data = this.getTileStats(tile);
      if(!data[tile]) {
        data[tile] = 1;
      } else {
        ++data[tile];
      }
      saveData(statsID, data);
    },

  };
})();
