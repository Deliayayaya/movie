//加载mongoose
var mongoose = require('mongoose');
//引入schemas/movies
var UserSchema = require('../schames/user');
var User = mongoose.model('User',UserSchema);
module.exports = User;