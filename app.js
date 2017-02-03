//加载express
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');//引入mongoose
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var serveStatic = require('serve-static');
ObjectId = mongoose.Schema.Types.ObjectId;
// var Movie = require('./models/movie');
// var User = require('./models/user');//引入user模块
var dbUrl = 'mongodb://127.0.0.1:27017/imooc';

//引入数据库
//mongoose.connect('mongodb://localhost/imooc');

mongoose.connect(dbUrl);
mongoose.Promise = global.Promise;
//设置端口，环境变量
var port = process.env.PORT || 3000;
//启动一个web服务器
var app = express();
app.set('views','./app/views/pages');//设置jade模板路径
app.set('view engine','jade');//设置引擎
//app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'bower_components')))
app.use(cookieParser());
app.use(require('connect-multiparty')());
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}));
if('development' === app.get('env')){//获取用户变量的值
	app.set('showStackError',true);
	app.use(morgan(':method :url :status'))//记录器
	app.locals.pretty = true;//优化压缩后的代码格式
	mongoose.set('debug',true);
}
require('./config/routes')(app);
app.locals.moment = require('moment')
app.listen(port);
console.log('imooc started at 3000');
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

