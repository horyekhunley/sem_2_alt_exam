const express = require('express')
const passport = require('passport')
const {getAllBlogs,
	createNewBlog,
	getBlogById,
	updateBlog,
	deleteBlog} = require("../controllers/blog.controllers");
const router = express.Router()
const authenticate = require('../authenticate')

router.route('/').get(getAllBlogs).post(authenticate.verifyUser, createNewBlog)

router.route('/:id')
		.get(authenticate.verifyUser, getBlogById)
		.put(authenticate.verifyUser, updateBlog)
		.delete(authenticate.verifyUser, deleteBlog)

module.exports = router