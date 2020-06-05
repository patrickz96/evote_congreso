var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var logger = require('morgan');
//var cookieSession = require('cookie-session')


//Security and performance
//var compression = require('compression');
//var helmet = require('helmet');

//Admin Controllers
var AuthController = require('./auth/AuthController');
var AdminController = require('./controllers/AdminController');
var ProcesoElectoralController = require('./controllers/admin/ProcesoElectoralController');
var TipoProcesoController = require('./controllers/admin/TipoProcesoController');
var ListaElectoralController = require('./controllers/admin/ListaElectoralController');
//User Controllers
var UserController = require('./controllers/UserController');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
/*
app.use(cookieSession(
{
  name: 'session',
  keys: ['status', 'msg','status2'] //google
}
));
*/


const session = require('express-session');
var passport = require('passport');

var google_profile;

/*
app.use(function(req, res, next) {
  //console.log("PASO POR AQUI",google_profile);
  //req.google_profile = google_profile;
  //req.session.google = google_profile;
  //google_profile = undefined;

  //req.google.data = google_profile;
  //req.session.status = "ok"; req.session.msg =  "PROCESO ELECTORAL: "+data.nombre+" REGISTRADO CORRECTAMENTE";
  
  //  var status = req.session.status;
  //  var msg = req.session.msg ;
  
  next();
});
*/


app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'ouis-0123',
  cookie: { maxAge: 15*60*1000 } 
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = "809514991769-abanc2gec860blavphoji94ivfl8c6s3.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "OcSr-m6Wky1WZ9HwqU3OVE_n";
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://evote.unsa.edu.pe/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      //userProfile=profile;
      google_profile= {email:profile.emails[0].value,name:profile.displayName};
      return done(null, google_profile);
  }
));

app.get('/auth/google',passport.authenticate('google', { scope : ['profile', 'email'] })); 
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }),
function(req, res) {
  // Successful authentication, redirect success.
  //res.redirect('/success');
  //console.log()
  req.session.google = google_profile;
  

  res.redirect('/assistance');
});


app.get('/logout', function(req, res) {
  //google_profile = undefined;
  req.session.google = undefined;
  res.redirect("/");
});


app.get('/success', (req, res) => res.send(google_email));
app.get('/error', (req, res) => res.send("error al intentar loguearse con google"));


// Security and Performance
//app.use(compression()); //Compress all routes
//app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', UserController);
app.use('/admin',AuthController);
app.use('/admin', AdminController);
app.use('/admin', ProcesoElectoralController);
app.use('/admin', TipoProcesoController);
app.use('/admin', ListaElectoralController);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //next(createError(404));
  res.send("Error 404. Pagina no encontrada");
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
