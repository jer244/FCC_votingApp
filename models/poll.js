var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pollSchema = new Schema ({
  creatorID: {type: String, required: true},
  pollTitle: {type: String, required: true},
  userID: [String],  //store users that already voted
  pollOptions: [{
    optionTitle: String,
    votes: {type: Number, default: 0}
  }]
});

/*
pollSchema.methods.getPolls = function(){
  return
};

pollSchema.methods. = function(){
  return
};

*/
module.exports = mongoose.model('Poll', pollSchema);
