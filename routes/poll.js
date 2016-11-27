var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Poll = require('../models/poll');

var csrfProtection = csrf({
    cookie: true
});

router.use(csrfProtection);

router.get('/vote', function(req, res, next) {
    if (req.query.id && req.query.entry) {
        Poll.findById(req.query.id, function(err, poll) {
            for (var i = 0; i < poll.pollOptions.length; i++) {
                if (poll.pollOptions[i].optionTitle == req.query.entry) {
                    poll.pollOptions[i].votes += 1;
                    if (req.isAuthenticated()) {
                        poll.userID.push(req.user.username);
                    }
                    //TODO: need to add ability to track unsigned in users
                    //also need to check if either voted before allowing to vote
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

router.get('/managePolls', function(req, res, next) {
    var polls = Poll.find(function(err, docs) {
        res.render('./poll/managePolls', {
            title: 'Poll-O-Rama',
            polls: docs,
            user: req.user.username
        });
    });
});

router.get('/create', function(req, res, next) {
    res.render('./poll/createPoll', {
        csrfToken: req.csrfToken(),
        alert: null
    });
});


router.post('/create', function(req, res, next) {
    if (!(req.body.pollTitle) || !(req.body.pollOptions)) {
        res.render('./poll/createPoll', {
            csrfToken: req.csrfToken(),
            alert: 'Please fill out Poll Title and Answers'
        })
    } else {
        var options = req.body.pollOptions.split(';');
        var allOptions = [];
        options.forEach(function(val) {
            allOptions.push({
                optionTitle: val,
                votes: 0
            });
        });
        var poll =
            new Poll({
                creatorID: req.user.username,
                pollTitle: req.body.pollTitle,
                userID: [], //store users that already voted
                pollOptions: allOptions
            });
        poll.save(function(err, result) {
            if (err) {
                throw err;
            } else {
                res.redirect('/');
            }
        })

    };
});

router.post('/vote', function(req, res, next) {
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

router.get('/delete', function(req, res, next) {
    if (req.query.id) {
        Poll.findById(req.query.id, function(err, poll) {
            if (err) {
                res.redirect('/');
            } else {
                poll.remove(function(err) {
                    if (err) {
                        res.send('failed remove')
                    } else {
                        var polls = Poll.find(function(err, docs) {
                            res.render('./poll/managePolls', {
                                title: 'Poll-O-Rama',
                                polls: docs,
                                user: req.user.username
                            });
                        });
                    }
                })
            }
        })
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
