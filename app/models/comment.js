//加载mongoose
var mongoose = require('mongoose');
//引入schemas/movies
var CommentSchema = require('../schames/comment');
var Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;