module.exports = function(api, message) {
    return new Promise((resolve) => {
        const { chat, from } = message;
        resolve(api.sendMessage(chat.id, '- help -'));
    });
};