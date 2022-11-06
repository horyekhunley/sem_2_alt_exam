const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const {Blog} = require('../models/blog.model')
const helper = require('./test.helper')

beforeEach(async () => {
	await Blog.deleteMany({})
	let blogObject = new Blog(helper.initialBlogs[0])
	await blogObject.save()
	blogObject = new Blog(helper.initialBlogs[1])
	await blogObject.save()

})

const api = supertest(app)

describe('Test blog routes', () => {
	test('blogs are returned as json', async() => {
		const response = await api
				.get('/api/v1/blogs')
				.expect(200)
				.expect('Content-type', /application\/json/)
				.expect(response.body).toHaveLength(helper.initialBlogs.length)
	}, 1000000)

	test('a specific blog is returned', async (req, res) => {
		const response = await api
				.get('/api/v1/blogs')
				.expect(200)
				.expect('Content-type', /application\/json/)
				const body = response.body.map(r => r.body)
		expect(body).toContain(
				'Testing api backend with jest and supertest'
		)
	})

	test('blogs can be created', async (req, res) => {
		await api
				.post('/api/v1/blogs')
				.expect(201)
				.expect('Content-type', /application\/json/)

		const response = await api.get('/api/v1/blogs')

		const blogsAtEnd = await helper.blogsInDb()
		expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

		const body = blogsAtEnd.map(b => b.body)
		expect(body).toContain(
			'async/await simplifies making async calls'
		)
	})
	test('blogs without content are not added', async (req, res) => {
		const newBlog = {
			title: 'learning how to test the backend',
			description: 'Testing api backend with jest and supertest',
			user: '636720cc1e1b7f99bc3f0266',
			reading_time: 60,
			body: 'Testing api backend with jest and supertest and async/await simplifies making async calls'
		}
		await api
				.post('/api/v1/blogs')
				.send(newBlog)
				.expect(400)
		const response = await api.get('/api/v1/blogs')

		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})
	test('a blog can be deleted', async (req, res) => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
				.delete(`/api/v1/blogs/${blogToDelete.id}`)
				.expect(204)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(
				helper.initialBlogs.length -1
		)
		const body = blogsAtEnd.map(r => r.body)
		expect(body).not.toContain(blogToDelete.body)
	})
})
afterAll(() => {
    mongoose.connection.close()
})