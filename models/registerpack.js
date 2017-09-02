var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var registerPackSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  pack: {type: Schema.Types.ObjectId,ref: 'Pack'},
  register:String,
})
module.exports = mongoose.model('RegisterPack', registerPackSchema);