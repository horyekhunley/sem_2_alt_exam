const jwt = require("jsonwebtoken")
const { Blog } = require("../models/blog.model")

const calculateReadingTime = body => {
	const wordsPerMinute = 250;
	const wordCount = body.split(' ').length;
	return Math.ceil(wordCount / wordsPerMinute);
  };
  
  const createBlog = async (req, res) => {
	try {
	  const { title, description, tags, body } = req.body;
	  const author = req.user._id;
	  const readingTime = calculateReadingTime(body);
	  const blog = new Blog({
		title,
		description,
		author,
		tags,
		body,
		readingTime
	  });
	  await blog.save();
	  res.status(201).json(blog);
	} catch (error) {
	  console.error(error);
	  res.status(500).send(error);
	}
  };
  
const updateBlog = async (req, res) => {
  try {
    const { title, description, state, tags, body } = req.body
    const readingTime = calculateReadingTime(body)
    const updatedBlog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        author: req.user._id,
      },
      {
        title,
        description,
        state,
        tags,
        body,
        readingTime,
      },
      { new: true }
    )
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" })
    }
    res.json(updatedBlog)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    })
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" })
    }
    res.json(deletedBlog)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const state = req.query.state || "published"
    const author = req.query.author
    const title = req.query.title
    const tags = req.query.tags
    const sort = req.query.sort || "-timestamp"
    const search = {
      state,
    }
    if (author) {
      search.author = author
    }
    if (title) {
      search.title = {
        $regex: title,
        $options: "i",
      }
    }
    if (tags) {
      search.tags = {
        $in: tags.split(","),
      }
    }
    const blogs = await Blog.find(search)
      .populate("author", "firstName lastName")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
    const count = await Blog.countDocuments(search)
    res.json({
      blogs,
      count,
      page,
      limit,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      {
        _id: req.params.id,
        state: "published",
      },
      {
        $inc: {
          readCount: 1,
        },
      },
      {
        new: true,
      }
    ).populate("author", "firstName lastName")
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" })
    }
    res.json(blog)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

const getUserBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const state = req.query.state || "all"
    const sort = req.query.sort || "-timestamp"
    const search = {
      author: req.user._id,
    }
    if (state !== "all") {
      search.state = state
    }
    const blogs = await Blog.find(search)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
    const count = await Blog.countDocuments(search)
    res.json({
      blogs,
      count,
      page,
      limit,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlogById,
  getUserBlogs,
}
