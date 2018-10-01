const TelegramBot = require('node-telegram-bot-api');

let bot = exports = module.exports = {};

bot.init = function init(token) {
    this.api = new TelegramBot(token, { polling: true });
    this.methods = [];

    this.api.on('message', (message) => {
        const { text, from } = message;

        if (!text) {
            return;
        }

        this.methods.forEach(method => {
            if (method.regex.test(text)) {
                method.function(this.api, message)
                    .then(
                        (value) => {}
                    )
                    .catch(
                        (reason) => {}
                    )
            }
        });
    });
};

bot.addMethod = function addMethod(regex, methodFunction) {
    this.methods.push({
        regex: regex,
        function: methodFunction
    });
};

bot.clearMethod = function clearMethod() {
    this.methods.clean();
};