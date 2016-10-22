//https://www.youtube.com/watch?v=XVYApTfR6XE ~10min

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

require('dotenv').config();  //comment out for production



var routes = require('./routes/index');
var userRoutes = require('./routes/user');
var pollRoutes = require('./routes/poll');


var app = express();

var sess = {
  secret: 'secretShit',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

if(app.get('env') === 'production'){
  app.set('trust proxy', 1),
  sess.cookie.secure = 'auto';
}

mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST);
require('./config/passport');

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
//app.use(cookieParser());
//app.use(session({secret: 'secretshit', resave: false, saveUninitialized: false}));
app.use(session(sess));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  next();
});

app.use('/user', userRoutes);
app.use('/poll', pollRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*app.set( 'port', ( process.env.PORT || 3000 ));
// Start node server
app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
  });
*/

module.exports = app;
