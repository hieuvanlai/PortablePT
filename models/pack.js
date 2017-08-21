var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var packSchema = new Schema({
    phoneNumber:String,
    packName:String,
    purpose:String,
    coach:String,
    price:String,
    duration:String,
    packImgUrl:String
  });

module.exports = mongoose.model('Pack', packSchema);
