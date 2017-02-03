var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');


//电影详情页面
exports.detail = function(req,res){
	// if(req.poster){
	// 	Objmovie.poster = req.poster;
	// }
	var id = req.params.id;
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
			if(err){
				console.log(err)
			}
	})
	Movie.findById(id,function(err,movie){
		Comment.find({movie:id})
				.populate('from','name')//多表关联查询
				.populate('reply.from reply.to','name')
				.exec(function(err,comments){
					// console.log(comments);
					if(err){
						console.log(err);
					}
					res.render('detail',{
					title:'详情页',
					movies:movie,
					comment:comments
					})
					// console.log(movies)
				})
		})
}
exports.savePoster = function(req,res,next){
	console.log(req)
	//通过name值拿到上传文件
		var posterData = req.files.uploadPoster;
		 // console.log(posterData);
	//拿到文件路径
		var filePath = posterData.path;
		 // console.log(filePath)
	//拿orginalFilename,
		var originalFilename = posterData.originalFilename;
	//根据名字是否存在判断
	console.log(req.files)
	if(originalFilename){
		// fs.rename(filePath,newPath,function(err){
		// 	if(err){
		// 		console.log(err);
		// 	}
		// })
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now();//定义个时间戳
			var type = posterData.type.split('/')[1];
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname,'../../','/public/upload/'+poster);
				// console.log(poster);
				// console.log(newPath)
		fs.writeFile(newPath,data,function(err){
			req.poster = '/public/upload/'+poster;
			 console.log(poster)
			next()
			})
		})
	}else{
		next()
	}

}
//admin updata 数据更新页中缓存的数据
exports.update = function(req,res){
	var id = req.params.id;
	// if(id.match(/^[0-9a-fA-F]{24}$/)){
	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				if(err){
					console.log(err);
				}
				res.render('admin',{
					title:'更新',
					movie:movie,
					categories:categories
				})
			})
		})
	}
}
//添加电影admin post 
exports.save = function(req,res){
	//是否更新数据，拿到id;
	var id = req.body.movie._id;
	//申明movie的变量,如果id不是undefined,先查到这部电影
	var Objmovie = req.body.movie;
	var _movie;
	if(req.poster){
		Objmovie.poster = req.poster;
	}
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
				//用新的字段替换掉老的字段(underscore)
			_movie = _.extend(movie,Objmovie);
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				//重定向
				res.redirect('/movie/' + movie._id);
			})
		})
	}else{
		//电影是新加的
		_movie = new Movie(Objmovie);
		var categoryId = Objmovie.category;//获取在电影save中的categoryId
		var	categoryName = Objmovie.categoryName;
		if(categoryId){
				_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
			Category.findById(categoryId,function(err,category){
				if(err){
					console.log(err);
				}
				category.movies.push(movie._id);//将电影id加到category表中
				category.save(function(err,category){
					res.redirect('/movie/' + movie._id);//保存后重定向
				})
			})
		})
		}else if(categoryName){//电影分类是新加入的
			var category = new Category({
				name:categoryName,
				movies:[_movie._id]
			})
			category.save(function(err,category){
				_movie.category = category._id;
				_movie.save(function(err,movie){
					res.redirect('/movie/'+_movie._id);
				})
			})
		}
	}
	
}
//电影列表页
exports.list = function(req,res){
	Movie.fetch(function(err,movie){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title:'列表页',
			movies:movie
		})

	})
}
//删除电影功能delete 
exports.del = function(req,res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id: id},function(err,movie){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		})
	}
}
//后台登录
exports.new = function(req,res){
	Category.find({},function(err,categories){
		res.render('admin',{
			title:'后台登录页',
			movie:{},
			categories:categories
		})
	})
}