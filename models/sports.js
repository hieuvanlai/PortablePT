var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var sportsSchema = new Schema({
    sportsImgUrl:String,
    sportsName:String
  });

module.exports = mongoose.model('Sports', sportsSchema);
