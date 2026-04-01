const mongoose = require('mongoose');

const StoreLocationSchema = new mongoose.Schema({
  name: String,
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  hours: String,
  contact: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StoreLocation', StoreLocationSchema);