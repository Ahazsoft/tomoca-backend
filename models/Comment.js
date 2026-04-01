const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: { type: Date, default: Date.now },
  review: Number,
  comment: String,
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);
