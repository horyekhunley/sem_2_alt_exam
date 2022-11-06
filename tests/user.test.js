const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const {User} = require('../models/user.model')

const api = supertest(app)

describe('user routes', (req, res) => {
	test('user can get all users', async () => {
		await api
				.get('/api/v1/users')
				.expect(200)
				.expect('Content-type', /application\/json/)
	})
	test('signup route returns a 200 status code', async () => {
		await api
				.post('/api/v1/users/signup')
				.expect(200)
				.expect('Content-type', /application\/json/)
	})
	test('login route returns a 200 status code', async () => {
		await api
				.post('/api/v1/users/login')
				.expect(200)
				.expect('Content-type', /application\/json/)
	})
	test('logout route', async () => {
		await api
				.get('/api/v1/users/logout')
				.expect(200)
				.expect('Content-type', /application\/json/)
	})
})

afterAll(() => {
	mongoose.connection.close()
})