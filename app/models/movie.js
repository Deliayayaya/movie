//加载mongoose
var mongoose = require('mongoose');
//引入schemas/movies
var MovieSchema = require('../schames/movie');
var Movie = mongoose.model('Movie',MovieSchema);
module.exports = Movie;