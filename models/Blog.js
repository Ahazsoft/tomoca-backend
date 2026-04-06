const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  id: Number,
  img: String,
  date: String,
  author: String,
  comments: Number,
  tags: Array,
  category: String,
  title: String,
  desc: String,
  sm_desc: String,
  blockquote: Boolean,
  video_id: String,
  audio_id: String,
  blog: String,
  featured: Boolean,
  createdAt: { type: Date, default: Date.now }
}, { id: false });

module.exports = mongoose.model('Blog', BlogSchema);