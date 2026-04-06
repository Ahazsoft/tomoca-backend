const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  review: Number,
  desc: String,
  user: String,
  name: String,
  designation: String,
  type: { type: String, enum: ['fashion', 'beauty', 'coffee'], default: 'coffee' },
  createdAt: { type: Date, default: Date.now },
  id: Number
}, { id: false, toJSON: { virtuals: false }, toObject: { virtuals: false } });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
