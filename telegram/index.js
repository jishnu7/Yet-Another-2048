var TelegramBot = require('node-telegram-bot-api');

var token = '259018779:AAGLRl7kcNTuGM9XnM30uyCa2UAsglK-POM';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
var i = 0;

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  bot.sendGame(chatId, 'ya2048');
});

// Gmae Query
bot.on('callback_query', function (msg) {
  console.log('request', ++i);

  var id = msg.id;

  bot.answerCallbackQuery(id, '2048', false, {
    url: 'https://j15h.nu/ya2048/game.html'
  });
});
