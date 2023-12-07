const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
require('dotenv').config();

const dbConfig = require('./configs/database')
const ratelimitConfig = require('./configs/ratelimit')

const app = express();

switch (app.get('env')) {
  case 'development':
    mongoose.connect(dbConfig.development.connectionString).then(() => console.log('Connected Development DB!'));
    break;
  case 'production':
    mongoose.connect(dbConfig.production.connectionString).then(() => console.log('Connected Production DB!'));
    break;
  default:
    throw new Error('Unknown execution environment ' + app.get('env'));
}

// view engine setup
app.engine('handlebars', hbs.engine({
  defaultLayout: 'layout',
  helpers: {
    add: function (a, b) {
      return a + b;
    },
    isEqual: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  }
}));
app.set('view engine', 'handlebars');

app.use(ratelimitConfig);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message)
  // render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render('404', { layout: null });
  } else {
    res.render('500', { layout: null });
  }

});

module.exports = app;