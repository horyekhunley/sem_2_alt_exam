const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()
const mongoose = require('mongoose')

const passport = require('passport');

const usersRoutes = require('./routes/user.routes')
const blogRoutes = require('./routes/blog.routes')

// db connection
mongoose
		.connect(process.env.MONGO_URI)
		.then(() => {
			console.log("MongoDB connected...");
		})
		.catch((err) => {
			console.log("MongoDB connection error", err);
			process.exit(1);
		})

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//passport initialization
app.use(passport.initialize());

app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/blogs', blogRoutes)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server listening on port: ${port}`))

module.exports = app