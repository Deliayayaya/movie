//加载express
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var _ = require('underscore');
var mongoose = require('mongoose');//引入mongoose
ObjectId = mongoose.Schema.Types.ObjectId;
var Movie = require('./models/movie');
var User = require('./models/user');//引入user模块
var dbUrl = 'mongodb://127.0.0.1:27017/imooc';

//引入数据库
//mongoose.connect('mongodb://localhost/imooc');

mongoose.connect(dbUrl);
mongoose.Promise = global.Promise;
//设置端口，环境变量
var port = process.env.PORT || 3000;
//启动一个web服务器
var app = express();
app.set('views','./views/pages');//设置jade模板路径
app.set('view engine','jade');//设置引擎
//app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'bower_components')))
app.use(cookieParser());
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}));
app.locals.moment = require('moment')
app.listen(port);
console.log('imooc started');
// var movie = new Movie({
// 			doctor:'wangliya',
// 			country:'美国',
// 			title:'机械战绩',
// 			year:2014,
// 			poster:'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
// 			language:'english',
// 			flash:'',
// 			summary:'abckefghijklmnopqrstuvwxyz'
// })
// movie.save(function(err){
// 	if(err)
// 		return handleError(err)
// })
//对user进行预处理，使用户登录后每个页面都正常显示user
app.use(function(req,res,next){
	var _user = req.session.user;
	if(_user){
		app.locals.user = _user;
		//app.locals在整个生命周期中起作用
	}
	return next();
})
//配置页面,路由
app.get('/index',function(req,res){
	// var _user = req.session.user;
	// if(_user){
	// 	app.locals.user = _user;
		
	// }
	console.log(req.session.user);
Movie.fetch(function(err,movie){
		if(err){
			console.log(err);
		}
		res.render('index',{
		title:'首页',
		movies:movie
		})
	})
})
//电影详情页面
app.get('/movie/:id',function(req,res){
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		// if(err){
		// 	console.log(err);
		// }
		res.render('detail',{
			title:'详情页',
			movies:movie
		})
	})
})
//admin updata 数据更新页中缓存的数据
app.get('/movie/update/:id',function(req,res){
	var id = req.params.id;
	// if(id.match(/^[0-9a-fA-F]{24}$/)){
		Movie.findById(id,function(err,movie){
		if(err){
			console.log(err);
		}
		res.render('admin',{
			title:'更新',
			movies:movie
		})
	})
})
//数据从前端post过来后进行处理，如果是存在的，要更新；如果是新加的要将其加入
// app.post('/admin/movie/new',function(req,res){
// 	var id = req.body.movie._id;
// 	var Objmovie = req.body.movie;
// 	var _movie;
// 	if(id !== undefined){
// 		Movie.findById(id,function(err,movie){
// 			if(err){
// 				console.log(err);
// 			}
// 			_movie = _.extend(movie,Objmovie);
// 			_movie.save(function(err,movie){
// 				if(err){
// 					console.log(err);
// 				}
// 			_res.redirect('/movie' + movie._id);
// 			})
// 		})
	
// 	}else{
// 		_movie = new Movie({
// 			doctor:Objmovie.doctor,
// 			title:Objmovie.title,
// 			country:Objmovie.country,
// 			language:Objmovie.language,
// 			year:Objmovie.year,
// 			poster:Objmovie.poster,
// 			summary:Objmovie.summary
// 		})
// 		_movie.save(function(err,movie){
// 			if(err){
// 					console.log(err);
// 				}
// 			_res.redirect('/movie' + movie._id);
// 		})
// 	}
// })
//添加电影admin post 
app.post('/admin/movie/new',function(req,res){
	//是否更新数据，拿到id;
	var id = req.body.movie._id;
	//申明movie的变量,如果id不是undefined,先查到这部电影
	var Objmovie = req.body.movie;
	var _movie;
	if(id !== undefined){
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
		_movie = new Movie({
			doctor:Objmovie.doctor,
			title:Objmovie.title,
			country:Objmovie.country,
			language:Objmovie.language,
			year:Objmovie.year,
			poster:Objmovie.poster,
			summary:Objmovie.summary,
			flash:Objmovie.flash
		})
		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			res.redirect('/movie/' + movie._id);
	})

	}
})
//电影列表页
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movie){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title:'列表页',
			movies:movie
		})

	})
})
//删除电影功能delete 
app.delete('/admin/list',function(req,res){
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
})
//后台登录
app.get('/admin',function(req,res){
	res.render('admin',{
		title:'后台登录页',
		movies:{
			title:'',
			doctor:'',
			country:'',
			year:'',
			poster:'',
			language:'',
			flash:'',
			summary:''
		}
	})
})
//用户注册后台处理
app.post('/user/register',function(req,res){
	var _user = req.body.user;//从前台页面获取user
	User.findOne({name: _user.name},function(err,user){
		if(err){
			console.log(err);
		}
		if(user){
			return res.redirect('/index');
		}else{
			var user = new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				res.redirect('/userlist');
			})
		}
	})
})
//注册成功返回数据处理
app.get('/userlist',function(req,res){
	User.fetch(function(err,user){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title:'用户注册页',
			users:user,
		})
	})
})
//post用户登录
app.post('/user/signin',function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name},function(err,user){
		if(err){
			console.log(err);
		}
		//如果用户不存在，返回首页
		if(!user){
			res.redirect('/index');
		}
			//传入当前password
			user.comparePassword(password,function(err,isMatch){
				if(err){
					console.log(err);
				}
				//如果密码正确，返回首页；不匹配打印输出“not match”
				if(isMatch){
					//获取user的session
					req.session.user = user;
					console.log('the password is matched');
					res.redirect('/index');
				}else{
					console.log('the password is not match');
				}
			})

		})

})
app.get('/loginout',function(req,res){
	delete req.session.user;
	delete app.locals.user;
	res.redirect('/index');
})