const TelegramBot = require('node-telegram-bot-api');
const NodeSchedule = require('node-schedule');

let bot = exports = module.exports = {};

bot.init = function(token) {
    this.api = new TelegramBot(token, { polling: true });
    this.methods = [];
    this.schedules = [];
    this.subscribers = new Set();

    this.api.on('message', (message) => {
        const {chat, text} = message;

        if (!text) {
            return;
        }

        if (!this.subscribers.has(chat.id.toString())) {
            this.sendMessage(chat.id, '[ERROR] 인가된 사용자가 아닙니다.');
            return;
        }

        this.methods.forEach(method => {
            const matches = text.match(method.regex);
            if (matches) {
                method.function(message, matches)
                    .then(
                        (message) => {
                            this.sendMessage(chat.id, message);
                        }
                    )
                    .catch(
                        (errorMessage) => {
                            this.sendMessage(chat.id, '[ERROR] ' + errorMessage);
                        }
                    )
            }
        });
    });
};

bot.addMethod = function(regex, methodFunction) {
    this.methods.push({
        regex: regex,
        function: methodFunction
    });
};

bot.clearMethod = function() {
    this.methods.clean();
};

bot.addSubscriber = function(subscribers) {
    subscribers.forEach((subscriber) => {
        this.subscribers.add(subscriber);
    });
};

bot.removeSubscriber = function(subscribers) {
    subscribers.forEach((subscriber) => {
        this.subscribers.delete(subscriber);
    });
};

bot.clearSubscriber = function() {
    this.subscribers.clear();
};

bot.sendMessage = function(subscriber, message) {
    this.api.sendMessage(subscriber, message).catch((error) => {
        // TODO: logger
        console.log(error);
    });
};

bot.sendMessageToSubscriber = function(message) {
    let sendPromises = [];
    this.subscribers.forEach((subscriber) => {
        sendPromises.push(this.api.sendMessage(subscriber, message))
    });
    return Promise.all(sendPromises).catch((error) => {
        // TODO: logger
        console.log(error);
    });
};

bot.addSchedule = function(cron, scheduleFunction) {
    let newSchedule = NodeSchedule.scheduleJob(cron, () => {
        scheduleFunction().then((message) => {
            if (message) {
                this.sendMessageToSubscriber(message);
            }
        }).catch((errorMessage) => {
            this.sendMessageToSubscriber('[ERROR] ' + errorMessage);
        })
    });
    this.schedules.push(newSchedule);
    return newSchedule;
};

bot.clearSchedule = function() {
    this.schedules.forEach((sch) => {
        sch.cancel();
    })
};
