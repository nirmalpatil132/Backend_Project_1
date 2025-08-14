const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Add comment
router.post('/:blogId', auth, async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      userId: req.user.id
    });
    res.json(comment);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get comments for a blog
router.get('/:blogId', async (req, res) => {
  try {
    const comments = await Comment.findAll({ where: { blogId: req.params.blogId } });
    res.json(comments);
  } catch (err) {
    res.status(500).send('Server error');
  }
});


module.exports = router;
