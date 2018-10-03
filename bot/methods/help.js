const botModule = require('../botModule');

module.exports = function(message) {
    return new Promise((resolve, reject) => {
        const { chat, from } = message;
        botModule.api.sendMessage(chat.id, '- help -').then((value) => {
            resolve(value);
        }).catch((error) => {
            reject(error);
        })
    });
};