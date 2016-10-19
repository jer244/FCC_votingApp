var User = require('../models/user');

require('dotenv').config();  //comment out for production

var mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST);

var users = [
      new User({
        username: 'one',
        password: 'oneiam'
      }),
      new User({
        username: 'two',
        password: 'twoiam'
      }),
      new User({
        username: 'three',
        password: 'threeiam'
      }),
      new User({
        username: 'four',
        password: 'fouriam'
      })
];

var done = 0;
for(var i =0; i < users.length; i++){
  users[i].save(function(err, result){
    done++;
    if(done === users.length){
      mongoose.disconnect();
    };
  });
};

mongoose.disconnect();
