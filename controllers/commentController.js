const Comment = require('../models/Comment');

exports.getAllComments = async (req, res) => {
  try {
    const { blogId } = req.query;
    let query = {};
    if (blogId) {
      query.blogId = Number(blogId);
    }
    const comments = await Comment.find(query);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
