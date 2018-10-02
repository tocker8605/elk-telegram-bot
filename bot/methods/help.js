module.exports = function(api, message) {
    return new Promise((resolve, reject) => {
        const { chat, from } = message;
        api.sendMessage(chat.id, '- help -').then((value) => {
            resolve(value);
        }).catch((error) => {
            reject(error);
        })
    });
};