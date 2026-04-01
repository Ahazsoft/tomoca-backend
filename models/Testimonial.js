const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  review: Number,
  desc: String,
  user: String,
  name: String,
  designation: String,
  type: { type: String, enum: ['fashion', 'beauty'], default: 'fashion' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
