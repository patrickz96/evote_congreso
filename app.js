var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var logger = require('morgan');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: "809514991769-abanc2gec860blavphoji94ivfl8c6s3.apps.googleusercontent.com",
    clientSecret: "OcSr-m6Wky1WZ9HwqU3OVE_n",
    callbackURL: "https://evote.unsa.edu.pe/assistance"
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return done(err, user);
       });
  }
));


//Security and performance
var compression = require('compression');
var helmet = require('helmet');

//Controllers
var AuthController = require('./auth/AuthController');
var AdminController = require('./controllers/AdminController');
var ProcesoElectoralController = require('./controllers/admin/ProcesoElectoralController');
var TipoProcesoController = require('./controllers/admin/TipoProcesoController');
var ListaElectoralController = require('./controllers/admin/ListaElectoralController');



/*
var ElectoralCensusController = require('./controllers/ElectoralCensusController');
var VoteController = require('./controllers/VoteController');
var AssistanceController = require('./controllers/AssistanceController');
*/
var UserController = require('./controllers/UserController');

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
app.use(cookieSession(
{
  name: 'session',
  keys: ['status', 'msg']
}
));


// Security and Performance
app.use(compression()); //Compress all routes
app.use(helmet());


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
         res.redirect('/');
       });

app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.use('/', UserController);
app.use('/admin',AuthController);
app.use('/admin', AdminController);
app.use('/admin', ProcesoElectoralController);
app.use('/admin', TipoProcesoController);
app.use('/admin', ListaElectoralController);


/*
app.use('/vote', VoteController);
app.use('/test', ElectoralCensusController);
app.use('/assistance',AssistanceController);
*/


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
