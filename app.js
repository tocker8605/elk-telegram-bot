const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const bot = require('./bot/botModule');
const botMethodHelp = require('./bot/methods/help');
const botMethodErrors = require('./bot/methods/errors');
const {elasticsearchCheckRecent} = require('./bot/operation/elasticsearch');

bot.init(process.env.TELEGRAM_TOKEN);
bot.addSubscriber(process.env.TELEGRAM_SUBSCRIBERS.split(','));
bot.addMethod(/^\/help/, botMethodHelp);
bot.addMethod(/^\/errors\s(.+?)\s(.+?)$/, botMethodErrors);
bot.addSchedule('* * * * *', () => {return elasticsearchCheckRecent('뉴썸', 'log-analytics-*', {'errormsg': 'read time out'}, 'now-360d', 100, 5)});

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
