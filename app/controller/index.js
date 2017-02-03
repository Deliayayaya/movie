//配置页面,路由
//11.15dianbiao679
var Movie = require('../models/movie');
var Category = require('../models/category');
exports.index = function(req,res){
	Category
		.find({})
		.populate({path:'movies',options:{limit:5}})
		.exec(function(err,categories){
			if(err){
			console.log(err);
			// console.log(categories)
		}
		res.render('index',{
		title:'首页',
		categories:categories
		})
	})
}
exports.search = function(req,res){
	var q = req.query.q;//从首页获取header中的q
	var catId = req.query.cat;//分类id
	var page = parseInt(req.query.p,10)||0;//页数
	var count = 2;
	var index = page*count;
	if(catId){
	Category.find({_id:catId})
			.populate({path:'movies',select:'title poster',options:{limit:2,skip:index}})
			.exec(function(err,categories){
				if(err){
					console.log(err);
				}
				var category = categories[0]||{};
				var movies = category.movies || [];
				var results = movies.slice(index,index+count);//
				res.render('results',{
					title:'搜索结果列表页面',
					keyword:category.name,
					currentPage:(page+1),//当前页面
					totalPage:Math.ceil(movies.length / 2),//总页面
					query:'cat='+catId,
					movies:results
				})
			})
	}else{
		Movie
			.find({title: new RegExp(q+'.*','i')})//用正则匹配
			.exec(function(err,movies){
				if(err){
					console.log(err)
				}
				// var category = categories[0] || {};
				// var movies = category.movies || [];
				var results = movies.slice(index,index+count)
				res.render('results',{
					title:'搜索结果列表页面',
					keyword:q,
					currentPage:(page+1),
					totalPage:Math.ceil(movies.length / 2),
					query:'q=' +catId,
					movies:results
				})
			})
	}
	// Category
	// 	.find({})
	// 	.populate({path:'movies',options:{limit:5}})
	// 	.exec(function(err,categories){
	// 		if(err){
	// 		console.log(err);
	// 	}
	// 	res.render('index',{
	// 	title:'首页',
	// 	categories:categories
	// 	})
	// })
}