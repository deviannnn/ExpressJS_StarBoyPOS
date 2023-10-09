const createError = require('http-errors');
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const themeRouter = require('./routes/theme');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const purchaseRouter = require('./routes/purchase');

const accountRouter = require('./routes/account');
const supplierRouter = require('./routes/supplier');
const customerRouter = require('./routes/customer');

const app = express();

// view engine setup
app.engine('handlebars', hbs.engine({
  defaultLayout: 'layout',
  helpers: {
    add: function (a, b) {
      return a + b;
    },
    isEqual: function (a, b, options) {
      return (a === b) ? options.fn(this) : options.inverse(this);
    }
  }
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/theme', themeRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/purchase', purchaseRouter);

app.use('/account', accountRouter);
app.use('/supplier', supplierRouter);
app.use('/customer', customerRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render('404', { layout: null });
  } else {
    res.render('500', { layout: null });
  }
  
});

module.exports = app;
