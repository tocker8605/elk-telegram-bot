const botModule = require('../botModule');
const {messages, template} = require('../messages/messageTemplateModule');

module.exports = function(message) {
    return new Promise((resolve, reject) => {
        const { chat, from } = message;
        botModule.api.sendMessage(chat.id, template(messages.HELP, chat.id)).then((value) => {
            resolve(value);
        }).catch((error) => {
            reject(error);
        })
    });
};