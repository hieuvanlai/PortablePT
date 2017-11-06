var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var studentsSchema = new Schema({
    name:String,
    msv:String,
    classs:String,
    nameMH:String,
    imgAvata:String
  });
  
module.exports = mongoose.model('students', studentsSchema);
