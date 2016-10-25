var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/loggedIn', isLoggedIn, function(req, res, next){
  res.render('./user/loggedIn');
});

router.get('/logout', isLoggedIn, function(req, res, next){
  req.logout();
  res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next){
  next();
});

router.get('/signup', function(req, res, next){
  var messages = req.flash('error');
  res.render('./user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/logIn', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/logIn', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/logIn', passport.authenticate('local.logIn', {
  successRedirect: '/',
  failureRedirect: '/user/logIn',
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/user/logIn');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
