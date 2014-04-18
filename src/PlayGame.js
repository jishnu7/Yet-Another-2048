/* jshint ignore:start */
import plugins.gameplay.gameplay as PlayGame;

import src.Utils as Utils;
/* jshint ignore:end */

exports = function() {
  var obj = {},
    busy = false,
    json = JSON.parse(CACHE['resources/conf/play_game.json']),
    achievements = json.achievements,
    leaderboards = json.leaderboards,
    // achievements
    /*
    isAchieved = function(val) {
      var ls = localStorage.getItem("record_achieved");
      ls  = ls ? JSON.parse(ls) : [];
      if(ls.indexOf(val) != -1) {
        return true;
      }
      return false;
    },
    setAchieved = function(val) {
      var ls = localStorage.getItem("record_achieved");
      ls  = ls ? JSON.parse(ls) : [];
      ls.push(val);
      localStorage.setItem("record_achieved", JSON.stringify(ls));
    },
    */
    // leaderboards
    getCurrentRecord = function(type) {
      var ls = localStorage.getItem("record_" + type);
      return ls ? parseInt(ls, 10): 0;
    },
    setRecord = function(type, value) {
      localStorage.setItem("record_" + type, value);
    },
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

  obj.login = function(cb, force) {
    if(obj.isLoggedIn() !== false || force) {
      PlayGame.login(function(evnt) {
        setLoggedIn(evnt);
        cb && cb(evnt);
      });
    }
  };

  obj.logout = function() {
    setLoggedIn(false);
    PlayGame.logout();
  };

  obj.showLeaderBoard = PlayGame.showLeaderBoard;
  obj.showAchievements = PlayGame.showAchievements;

  obj.run = function(data) {
    while(data.length > 0) {
      var req = data.shift();
      PlayGame[req.type].apply(this, req.data);
    }
  };

  obj.achievement = function(val) {
    if(!obj.isLoggedIn()) {
      return;
    }
    if(achievements.hasOwnProperty(val)) {
      var data = getQueue();
      data.push({
          type: 'sendAchievement',
          data: [achievements[val], val]
        });
      //setAchieved(val);
      this.run(data);
    }
  };

  obj.leaderboard = function(type, val) {
    if(!obj.isLoggedIn()) {
      return;
    }
    var data = getQueue();

    if(val > getCurrentRecord(type)) {
      data.push({
          type: 'sendScore',
          data: [leaderboards[type], val]
        });
      setRecord(type, val);
    }
    this.run(data);
  };

  return obj;
}();
