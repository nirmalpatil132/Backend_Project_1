const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Create Blog
router.post('/', auth, async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, userId: req.user.id });
    res.json(blog);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all Blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
