var Index = require('../app/controller/index');
var User = require('../app/controller/user');//引入user模块
var Movie= require('../app/controller/movie');
var Comment = require('../app/controller/comment');
var Category = require('../app/controller/category');

module.exports = function(app){

//对user进行预处理，使用户登录后每个页面都正常显示user
app.use(function(req,res,next){
	var _user = req.session.user;
	// if(_user){
		app.locals.user = _user;
		//app.locals在整个生命周期中起作用
	// }
	 next();
})
app.get('/index',Index.index)
//电影详情页面
app.get('/movie/:id',Movie.detail)
//admin updata 数据更新页中缓存的数据
app.get('/movie/update/:id',User.signinRequired,User.adminRequired,Movie.update)

//添加电影admin post 
app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save)
//电影列表页
app.get('/admin/list',User.signinRequired,User.adminRequired,Movie.list)
//删除电影功能delete 
app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.del)
//后台登录
app.get('/admin',User.signinRequired,User.adminRequired,Movie.new)


//用户注册后台处理
app.post('/user/register',User.register)
//注册成功返回数据处理
app.get('/userlist',User.signinRequired,User.adminRequired,User.list)
//删除用户
app.delete('/user/delete',User.del)
//post用户登录
app.post('/user/signin',User.signin)
app.get('/loginout',User.loginout)
//用户注册页面
app.get('/register',User.showRegister)
//用户登录页面
app.get('/signin',User.showSignin)
//用户修改密码
app.get('/user/change',User.modify)


//提交评论
app.post('/user/comment',User.signinRequired,Comment.save)


//分类
app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.new)
app.post('/admin/category',User.signinRequired,User.adminRequired,Category.save)
app.get('/admin/categorylist',User.signinRequired,User.adminRequired,Category.list)
app.delete('/admin/categorylist',User.signinRequired,User.adminRequired,Category.del)


//搜索及分页
app.get('/results',Index.search)
}