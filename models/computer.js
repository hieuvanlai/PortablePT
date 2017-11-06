var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var computersSchema = new Schema({
    namecomputer:String,
    maytrong:String,
    mayhong:String,
    info:String
  });
  
module.exports = mongoose.model('students', packSchema);
