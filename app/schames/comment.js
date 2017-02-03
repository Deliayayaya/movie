var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var CommentSchema = new Schema({
	//当前要存的页面
	movie:{type:ObjectId,ref:'Movie'},
	from:{type:ObjectId,ref:'User'},
	reply:[{
		from:{type:ObjectId,ref:'User'},
		to:{type:ObjectId,ref:'User'},
		content:String
	}],
	content:String,
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
CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})
//创建MovieSchema的静态方法，fetch这个方法，取出数据库中所有的数据
CommentSchema.statics={
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
//导出module.exports;
module.exports = CommentSchema;