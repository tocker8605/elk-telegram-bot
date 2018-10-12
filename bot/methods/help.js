const {messages, template} = require('../messages/messageTemplateModule');

module.exports = function(message, matches) {
    return new Promise((resolve, reject) => {
        const { chat, from } = message;
        resolve(template(messages.HELP, chat.id));
    });
};