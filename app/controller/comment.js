var Comment = require('../models/comment');

//comment
exports.save = function(req,res){
	var _comment = req.body.comment;
	var movieId = _comment.movie;
	var cid = _comment.cid;//一级评论
	var tid = _comment.tid;//二级评论
	if(cid){//如果有一级评论，查找一级评论的id
		Comment.findById(cid,function(err,comment){
			if(err){
				console.log(err);
			}
			var reply = {
				form:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			comment.reply.push(reply);
			console.log(reply)
			comment.save(function(err,comment){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movieId)
			})
		})
	}else{
		var comment = new Comment(_comment);
		comment.save(function(err,comment){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movieId);
		})
	}
}
