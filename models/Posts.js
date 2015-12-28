var mongoose = require('mongoose')

var PostSchema = new mongoose.Schema({
	title: String,
	body: String,
	date: { type: Date, default: Date.now },
})

mongoose.model('Post', PostSchema)