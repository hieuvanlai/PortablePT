var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  phoneNumber:String,
  password: String,
  username:String,
  id:String,
  imgAvatar:String,
  name:String,
  email:String,
  gender:String,
  birthday:String,
  location:String,
  role:String
});
userSchema.index({'$**': 'text'});
module.exports = mongoose.model('User', userSchema);
