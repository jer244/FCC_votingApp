var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Poll = require('../models/poll');

/* GET home page. */
router.get('/', function(req, res, next) {
  var polls = Poll.find(function(err, docs){
    res.render('index', { title: 'Poll-O-Rama', polls: docs});
  });
});


module.exports = router;
