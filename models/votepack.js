var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var votepackSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  pack: {type: Schema.Types.ObjectId,ref: 'Pack'},
  star:Number
})
module.exports = mongoose.model('VotePack', votepackSchema);