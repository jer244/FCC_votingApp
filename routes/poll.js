var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Poll = require('../models/poll');


var csrfProtection = csrf({cookie: true});

router.use(csrfProtection);

router.get('/vote', function(req, res, next) {
    if (req.query.id && req.query.entry) {
        Poll.findById(req.query.id, function(err, poll) {
            for (var i = 0; i < poll.pollOptions.length; i++) {
                if (poll.pollOptions[i].optionTitle == req.query.entry) {
                    poll.pollOptions[i].votes += 1;
                    poll.save(function(err, updatedPoll) {
                        if (err) throw err;
                        res.redirect('/poll?id=' + req.query.id);
                    })
                }
            };
        });
    } else {
        res.redirect('/');
    };
});

router.post('/vote', function(req, res, next){
  if (req.body.writeIn) {
      Poll.findById(req.body.id, function(err, poll) {
          poll.pollOptions.push({
            optionTitle: req.body.writeIn,
            votes: 1
          });
          poll.save(function(err, updatedPoll) {
              if (err) throw err;
              res.redirect('/poll?id=' + req.body.id);
          })
        });
          } else {
      res.redirect('/');
  };
});


router.get('/', function(req, res, next) {
    if (req.query.id) {
        Poll.findById(req.query.id, function(err, poll) {
            res.render('./poll/viewPoll', {
                poll: poll,
                csrfToken: req.csrfToken()
            });
        })
    } else {
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
