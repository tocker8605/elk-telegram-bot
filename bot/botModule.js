const TelegramBot = require('node-telegram-bot-api');
const NodeSchedule = require('node-schedule');

let bot = exports = module.exports = {};

bot.init = function(token) {
    this.api = new TelegramBot(token, { polling: true });
    this.methods = [];
    this.schedules = [];

    this.api.on('message', (message) => {
        const { text, from } = message;

        if (!text) {
            return;
        }

        this.methods.forEach(method => {
            if (method.regex.test(text)) {
                method.function(this.api, message)
                    .then(
                        (value) => {
                            // TODO: logger
                            console.log(value);
                        }
                    )
                    .catch(
                        (reason) => {
                            console.log(reason);
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

bot.addSchedule = function(cron, scheduleFunction, subscribers) {
    let newSchedule = NodeSchedule.scheduleJob(cron, scheduleFunction.bind(null, this.api, subscribers));
    this.schedules.push(newSchedule);
    return newSchedule;
};

bot.clearSchedule = function() {
    this.schedules.forEach((sch) => {
        sch.cancel();
    })
};