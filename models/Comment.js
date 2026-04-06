const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: String,
  email: String,
  date: { type: String }, // Switched to String to match frontend data (e.g. "12 April, 2023 at 3.50pm")
  review: Number,
  comment: String,
  blogId: { type: Number }, // Use numeric ID to reference blogs
  user: String, // Added user image URL field
  children: {
    name: String,
    date: String,
    comment: String, // Match frontend structure
    user: String
  },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: false },
  toObject: { virtuals: false },
  id: false
});

module.exports = mongoose.model('Comment', CommentSchema);
