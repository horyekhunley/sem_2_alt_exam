const mongoose = require('mongoose')
const User = require('../models/user.model')

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: ['Title field is required', true],
	},
	description: {
		type: String,
		required: ['Description field is required', true],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	state: {
		type: String,
		enum : ['draft','published'],
		default: 'draft'
	},
	read_count: {
		type: Number,
		default: 0,
	},
	reading_time: {
		type: Number,
		required: true,
	},
	tags: {
		type: String,
		enum: [ 'Programming', 'Javascript', 'Java', 'TypeScript', 'Python', 'Rust', 'Product design', 'UI/UX', 'Code Newbie' ]

	},
	body: {
		type: String,
		required: ['There is nothing in the body of your blog', true],
	},

}, { timestamps: true })

const Blog = mongoose.model('blog', blogSchema)

module.exports = {
	Blog
}