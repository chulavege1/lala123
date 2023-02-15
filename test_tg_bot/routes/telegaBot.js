const TelegramBot = require('node-telegram-bot-api');


const telegaBot = (param) => {

  console.log('param', param);

  console.log('the response will be sent by the next function ...');
    // replace the value below with the Telegram token you receive from @BotFather
    const token = '5905791429:AAEszFq4I51W6DtmhahAWBPNiQMxUamrQs0';

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, { polling: false });

    // Matches "/echo [whatever]"
    bot.onText(/\/echo (.+)/, (msg, match) => {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message

      const chatId = msg.chat.id;
      console.log('msg.chat.id1111', msg.chat.id);
      const resp = match[1]; // the captured "whatever"

      // send back the matched "whatever" to the chat
      bot.sendMessage(chatId, resp);
    });

    // Listen for any kind of message. There are different kinds of
    // messages.
    bot.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log('chatId', chatId);
      // send a message to the chat acknowledging receipt of their message
      bot.sendMessage(chatId, 'dadsadas');
  });

}

module.exports = telegaBot