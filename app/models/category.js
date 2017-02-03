//加载mongoose
var mongoose = require('mongoose');
//引入schemas/movies
var CategorySchema = require('../schames/category');
var CategorySchema = mongoose.model('CategorySchema',CategorySchema);
module.exports = CategorySchema;