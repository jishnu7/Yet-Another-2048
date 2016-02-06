/* jshint ignore:start */
import gameplay as PlayGame;

import src.Utils as Utils;
/* jshint ignore:end */

exports = (function() {
  var obj = {},
    busy = false,
    json = JSON.parse(CACHE['resources/conf/play_game.json']),
    setLoggedIn = function(value) {
      localStorage.setItem('playgame', value);
    };

  obj.isLoggedIn = function() {
    var ls = localStorage.getItem('playgame');
    if(ls) {
      return ls === 'true' ? true : false;
    } else {
      return null;
    }
  };

  obj.login = function(cb) {
    if(!busy && (obj.isLoggedIn() !== false || cb)) {
      busy = true;
      PlayGame.login(function(evnt) {
        setLoggedIn(evnt);
        cb && cb(evnt);
        busy = false;
      });
    }
  };

  obj.logout = function(cb) {
    setLoggedIn(false);
    PlayGame.logout();
    if(cb) {
      cb();
    }
  };

  obj.showLeaderBoard = function() {
    PlayGame.showLeaderBoard();
  };

  obj.showAchievements = function() {
    PlayGame.showAchievements();
  };

  obj.run = function(req) {
    PlayGame[req.type].apply(this, req.data);
  };

  obj.achievement = function(val, mode) {
    if(!obj.isLoggedIn()) {
      return;
    }
    var achievements = mode === 'time' ? json.achievements_time : json.achievements;
    if(achievements.hasOwnProperty(val)) {
      obj.run({
        type: 'sendAchievement',
        data: [achievements[val], val]
      });
    }
  };

  obj.leaderboard = function(type, val) {
    if(!obj.isLoggedIn()) {
      return;
    }
    var leaderboards = json.leaderboards;
    obj.run({
      type: 'sendScore',
      data: [leaderboards[type], val]
    });
  };

  return obj;
})();
