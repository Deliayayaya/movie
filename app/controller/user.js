var User = require('../models/user');//引入user模块
//注册页面跳转
exports.showRegister = function(req,res){
	res.render('register',{
		title:'用户注册页面'
	})
}
//登录页面跳转
exports.showSignin = function(req,res){
	res.render('signin',{
		title:'用户登录页面'
	})

}
//用户注册后台处理
exports.register = function(req,res){
	var _user = req.body.user;//从前台页面获取user
	User.findOne({name: _user.name},function(err,user){
		if(err){
			console.log(err);
		}
		var name = user.name;
		//判断用户名长度>0，防止用户名为空也调到登录页面
		if(name.length>0){
			//如果已经注册过的跳转到登录页面
			return res.redirect('/signin');
		}else{
			var user = new User(_user);
			user.save(function(err,user){
				if(err){
					console.log(err);
				}
				res.redirect('/index');
				// res.redirect('/userlist');
			})
		}
	})
}
//注册成功返回数据处理
exports.list = function(req,res){
	User.fetch(function(err,user){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title:'用户注册页',
			users:user,
		})
	})
}

//post用户登录
exports.signin = function(req,res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name},function(err,user){
		if(err){
			console.log(err);
		}
		//如果用户不存在，跳转到注册页面 
//此处页面跳转有问题
		if(!user){
			res.redirect('/register');
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
					res.redirect('/signin');
					console.log('the password is not match');
				}
			})
		})
}
exports.loginout = function(req,res){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/index');
}
exports.signinRequired = function(req,res,next){
	var user = req.session.user;
	if(!user){
		 res.redirect('/signin')
	}
	next();
}
exports.adminRequired = function(req,res,next){
	var user = req.session.user;
	// console.log(user);
	if(user.role<10){
		res.redirect('/signin')
	}
	next();
}
//用户修改密码
exports.modify = function(req,res,next){
	
}
//删除用户
exports.del = function(req,res){
	var id = req.query.id;
	if(id){
		User.remove({_id:id},function(err,user){
			if(err){
				console.log(err);
			}else{
				res.json({success:1});
			}

		})
	}
}