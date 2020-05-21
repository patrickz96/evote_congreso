var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var logger = require('morgan');

//Controllers
var AuthController = require('./auth/AuthController');
var ElectoralCensusController = require('./controllers/ElectoralCensusController');
var AdminController = require('./controllers/AdminController');
var UserController = require('./controllers/UserController');
var VoteController = require('./controllers/VoteController');
var AssistanceController = require('./controllers/AssistanceController');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['status', 'msg']
}));

app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/admin',AuthController);
app.use('/', UserController);
app.use('/admin', AdminController);
app.use('/vote', VoteController);
app.use('/test', ElectoralCensusController);
app.use('/assistance',AssistanceController);



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
