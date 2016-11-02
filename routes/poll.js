var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Poll = require('../models/poll');


var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', function(req, res, next){
  if(req.query.id){
    Poll.findById(req.query.id, function(err, poll){
      res.render('./poll/viewPoll', { poll: poll});
    })
  }else{
  res.redirect('/');
};
});

/*
var express = require('express');
var router = express.Router();

var User = require('../../models/user');
var Poll = require('../../models/poll');

var currentPoll = Poll.findOne({_id: id}, function(err, doc){
  if(err){
    console.log(err);
  }
  console.log(doc + 'doc');
});
*/

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
