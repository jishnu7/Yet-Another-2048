
exports = (function() {
  var prevGameID = 'prev_game',
    statsID = 'stats_tile',
    statsGame = 'stats_game',
    tutorialID = 'tutorials',
    saveData = function(id, data) {
      localStorage.setItem(id, JSON.stringify(data));
    },
    getData = function(id) {
      return JSON.parse(localStorage.getItem(id));
    };

  return {
    // Function to save the game to local storage
    saveGame: function(game) {
      var cells = [],
        score = game.score;
      score.saveHighScore();
      game.eachCell(function(row, col, cell) {
        if(cell) {
          cells.push({row: row, col: col, value: cell.getValue()});
        }
      });
      saveData(prevGameID, {
        cells: cells,
        mode: game.mode,
        score: score.score,
        highestTile: score.highestTile,
        timer: score.timer,
        speed: game.timer.get()
      });
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
      if(tile < 8) {
        return;
      }
      var data = this.getTileStats(tile);
      if(!data[tile]) {
        data[tile] = 1;
      } else {
        ++data[tile];
      }
      saveData(statsID, data);
    },

    getGameStats: function() {
      return getData(statsGame) || [];
    },

    saveGameStats: function(game) {
      var data = this.getGameStats(),
        score = game.score;
      data.push({
        mode: game.mode,
        score: score.score,
        time: score.timer,
        highestTile: score.highestTile,
      });
      saveData(statsGame, data);
    },

    isTutorialCompleted: function(id) {
      var data = getData(tutorialID) || [];
      return data.indexOf(id) !== -1;
    },

    setTutorialCompleted: function(id) {
      var currentData = getData(tutorialID) || [];
      currentData.push(id);
      setLocalData(currentData);
    }
  };
})();
