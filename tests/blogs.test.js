
const request = require('supertest');
const app = require('../app');
const { User } = require('../models/blog.model');

let user;
let token;

beforeEach(async () => {
  await User.deleteMany();
  user = new User({
    email: 'test@example.com',
    password: 'password',
    firstName: 'Test',
    lastName: 'User'
  });
  await user.save();
});

describe('POST /users/signup', () => {
  it('creates a new user', async () => {
    const newUser = {
      email: 'newuser@example.com',
      password: 'password',
      firstName: 'New',
      lastName: 'User'
    };
    const res = await request(app)
      .post('/users/signup')
      .send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('email', newUser.email);
    expect(res.body).toHaveProperty('firstName', newUser.firstName);
    expect(res.body).toHaveProperty('lastName', newUser.lastName);
  });
});

describe('POST /users/signin', () => {
  it('signs in an existing user', async () => {
    const res = await request(app)
      .post('/users/signin')
      .send({
        email: user.email,
        password: user.password
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });
});
