var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var url = require('url');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', function(req, res, next){
  if(req.query.id){
    console.log(req.query.id);
    res.send(req.query.id);
  }else{
  res.redirect('/');
};
});


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
