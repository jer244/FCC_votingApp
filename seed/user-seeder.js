var User = require('../models/user');

var mongoose = require('mongoose');

mongoose.connect('mongodb://test:test@ds035846.mlab.com:35846/hurley_fcc_votingapp_users');

var users = [
      new User({
        username: 'Jeremy',
        password: 'jeremyiam'
      }),
      new User({
        username: 'Carrie',
        password: 'carrieiam'
      }),
      new User({
        username: 'George',
        password: 'georgeiam'
      }),
      new User({
        username: 'Will',
        password: 'william'
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
