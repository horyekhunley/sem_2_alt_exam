const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('Test if response is json', () => {
	test('notes are returned as json', async() => {
		await request(api)
				.get('/api/v1/blogs')
				.expect(200)
				.expect('Content-type', /json/)
	})
})
afterAll(() => {
    mongoose.connection.close()
})