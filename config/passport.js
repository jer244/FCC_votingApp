var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, username, password, done){
  req.checkBody('username', 'Invalid Username - please include user').notEmpty();
  req.checkBody('password', 'Invalid Password - minimum of 6 characters').notEmpty().isLength({min:6});
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }

  User.findOne({'username': username}, function(err, user){
    if(err) {
      return done(err);
    }
    if (user){
      return done(null, false, {message: 'Username is already in use.'});
    }
    var newUser = new User();
    newUser.username = username;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function(err, result){
      if(err){
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, username, password, done) {
  req.checkBody('username', 'Invalid Username - please include user').notEmpty();
  req.checkBody('password', 'Invalid Password - minimum of 6 characters').notEmpty().isLength({min:6});
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
}
User.findOne({'username': username}, function(err, user){
  if(err) {
    return done(err);
  }
  if (!user){
    return done(null, false, {message: 'Username not found.'});
  }
  if (!user.validPassword(password)) {
    return done(null, false, {message: 'Wrong Password.'});
  }
  return done(null, user);
  });
}));
