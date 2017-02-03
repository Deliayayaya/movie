var mongoose = require('mongoose');
 var bcrypt = require('bcryptjs');
//引入加密模块
 var SALT_WORK_FACTOR = 10;
//定义加密强度
var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:
	{
		unique:true,
		type:String
	},
	role:{
		type:Number,
		default:0
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})
//每次存数据前都调用这个方法，判断是否是新的数据
UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	var hash = bcrypt.hashSync(this.password);
	this.password = hash;
	next();
	 // bcrypt.hash(user.password,null,null,function(err,hash){
	 // 	if(err){
	 // 		return next(err);
	 // 	}
	 // 	user.password = hash;
	 // 	next();
	 // })
	// bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
	// 	if(err){
	// 		return next(err);
	// 	}
	// 	bcrypt.hash(user.password,salt,function(err,hash){
	// 		if(err){
	// 			return next(err);
	// 		}
	// 		user.password = hash;
	// 		next();
	// 	})
	// })
})
//添加实例方法comparePassword
UserSchema.methods = {
	comparePassword:function(_password,cb){
		var hash = this.password;
		bcrypt.compare(_password,hash,function(err,res){
			if(err) {
				cb(err);
			}
			cb(null,res);
		
		});
			
	}
}
UserSchema.statics={
	fetch:function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb);
	},
	//findById查询单条数据
	findById:function(id,cb){
		// if(id.match(/^[0-9a-fA-F]{24}$/)){
			return this
				.findOne({_id:id})
				.exec(cb);
		// }
	}
}
module.exports = UserSchema;












// userSchema.pre('save',function(next){
// 	var user = this;
// 	if(this.isNew){
// 		this.meta.createAt = this.meta.updateAt = Date.now();
// 	}else{
// 		this.meta.updateAt = Date.now();
// 	}
// 	next();
// 	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
// 		if(err){
// 			return next(err);
// 		}
// 		bcrypt.hash(user.password,salt,function(err,hash){
// 			if(err){
// 			return next(err);
// 		}
// 		user.password = hash;
// 		next();
// 		})
// 	})
// })
