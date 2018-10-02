module.exports = function(api, subscribers) {
    return new Promise((resolve, reject) => {
        let sendPromises = [];
        subscribers.forEach((subscriber) => {
            sendPromises.push(api.sendMessage(subscriber, 'Hello'))
        });
        Promise.all(sendPromises).then((values) => {
            resolve(values);
        }).catch((error) => {
            reject(error);
        })
    });
};