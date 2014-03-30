/* jshint ignore:start */
import plugins.gameplay.gameplay as PlayGames;

import src.Utils as Utils;
/* jshint ignore:end */

exports = function() {
  var obj = {},
    busy = false,
    achievements = {
      16:   'abc',
      32:   'abc',
      64:   'abc',
      128:  'abc',
      256:  'abc',
      512:  'abc',
      1024: 'abc',
      2048: 'abc',
      4096: 'abc',
      8192: 'abc'
    },
    leaderboards = {
      score:'abcabc',
      tile: 'abcabc'
    },
    getQueue = function() {
      var ls = localStorage.getItem("pending");
      return ls ? JSON.parse(ls): [];
    },
    setQueue = function(val) {
      localStorage.setItem("pending", JSON.stringify(val));
    },
    // achievements
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
    // leaderboards
    getCurrentRecord = function(type) {
      var ls = localStorage.getItem("record_" + type);
      return ls ? parseInt(ls, 10): 0;
    },
    setRecord = function(type, value) {
      localStorage.setItem("record_" + type, value);
    };

  obj.login = PlayGames.login;
  obj.showLeaderBoard = PlayGames.showLeaderBoard;

  obj.run = function(data) {
    data = data || getQueue();

    if(navigator.onLine && !busy) {
      busy = true;
      finish = Utils.finish(data.length, function() {
        busy = false;
        setQueue(data);
      });

      while(data.length > 0) {
        var req = data.shift();
        PlayGames[req.type].apply(this, req.data);
        finish();
      }
    }
  };

  obj.achievement = function(val) {
    if(achievements.hasOwnProperty(val) && !isAchieved(val)) {
      var data = getQueue();
      data.push({
          type: 'sendAchievement',
          data: [achievements[val], val]
        });
      setAchieved(val);
      setQueue(data);
      this.run(data);
    }
  };

  obj.leaderboard = function(type, val) {
    var data = getQueue();

    if(val > getCurrentRecord(type)) {
      data.push({
          type: 'sendScore',
          data: [leaderboards[type], val]
        });
      setRecord(type, val);
    }
    setQueue(data);
    this.run(data);
  };

  return obj;
}();
