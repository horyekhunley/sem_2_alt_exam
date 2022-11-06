const {Blog} = require('../models/blog.model')

exports.initialBlogs = [
	{
		title: 'Testing the backend',
		description: 'Testing api backend with jest and supertest',
		user: '636720cc1e1b7f99bc3f0266',
		reading_time: 60,
		body: 'Testing api backend with jest and supertest'
	}
]
exports.nonExistingId = async () => {
	const blog = new Blog({ body: 'willremovethissoon'})
	await blog.save()
	await blog.remove()

	return blog._id.toString()
}
exports.blogsInDb = async (req, res) => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}