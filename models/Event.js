const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: String,
  description: String,
  image: String,
  color: String,
  textColor: String,
  buttonBgColor: String,
  buttonText: String,
  link: String,
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: false },
  toObject: { virtuals: false },
  id: false
});

module.exports = mongoose.model('Event', EventSchema);
