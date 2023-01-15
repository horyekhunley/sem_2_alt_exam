const express = require('express');
const router = express.Router();
const auth = require('../authenticate')
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
  getUserBlogs
} = require('../controllers/blog.controllers')

router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.get('/me', auth, getUserBlogs);

module.exports = router;
