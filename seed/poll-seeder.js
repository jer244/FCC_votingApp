var Poll = require('../models/poll');

require('dotenv').config();  //comment out for production

var mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@' + process.env.DB_HOST);

var poll = [
      new Poll({
        creatorID: 'aMan',
        pollTitle: 'title A',
        userID: ['aMan', 'bMan', 'cMan'],  //store users that already voted
        pollOptions: [{
          optionTitle: 'optionA',
          votes: 1
        },
        {
          optionTitle: 'optionB',
          votes: 3
        },
        {
          optionTitle: 'optionC',
          votes: 4
        }]
      }),
      new Poll({
        creatorID: 'bMan',
        pollTitle: 'title B',
        userID: ['aMan', 'bMan', 'cMan'],  //store users that already voted
        pollOptions: [{
          optionTitle: 'optionA',
          votes: 1
        },
        {
          optionTitle: 'optionB',
          votes: 3
        },
        {
          optionTitle: 'optionC',
          votes: 4
        }]
      })
];

var done = 0;
for(var i =0; i < poll.length; i++){
  poll[i].save(function(err, result){
    done++;
    if(done === poll.length){
      mongoose.disconnect();
    };
  });
};

mongoose.disconnect();
