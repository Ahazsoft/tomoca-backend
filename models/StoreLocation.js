const mongoose = require('mongoose');

const StoreLocationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: String,
  address: String,
  img: String, // Background image for store card
  location: String, // Google Maps URL
  coordinates: {
    lat: Number,
    lng: Number
  },
  hours: String,
  contact: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: false },
  toObject: { virtuals: false },
  id: false
});

module.exports = mongoose.model('StoreLocation', StoreLocationSchema);