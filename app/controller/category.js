var Movie = require('../models/movie');
var Category = require('../models/category');
var _ = require('underscore');
//poster

exports.new = function(req,res){
	res.render('category_admin',{
		title:'后台分类页面',
		category:{}
	})
}

exports.save = function(req,res){
	var _category = req.body.category;
	var category = new Category(_category);
	category.save(function(err,category){
		if(err)
		{
			console.log(err)
		}
		res.redirect('/admin/categorylist');
	})
}
exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err);
		}
		res.render('category_list',{
			title:'分类列表页',
			categories:categories
		})

	})
}
//删除电影功能delete 
exports.del = function(req,res){
	var id = req.query.id;
	if(id){
		Category.remove({_id: id},function(err,category){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}
		})
	}
}
