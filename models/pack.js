var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var packSchema = new Schema({
    packName:String,
    purpose:String,
    coach: { type: Schema.Types.ObjectId, ref: 'User' },
    price:String,
    duration:String,
    packImgUrl:String,
    address:String,
    type:String,
    coutStar:Number,
    mediumStar:Number,
    calendar:String,
    content:String
  });
packSchema.index({'$': 'text'});
module.exports = mongoose.model('Pack', packSchema);
