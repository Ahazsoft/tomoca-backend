const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  price: Number,
  discount: Number,
  status: String,
  parent: String,
  children: String,
  brand: Object,
  imageURLs: Array,
  createdAt: { type: Date, default: Date.now },
  description: String,
  category: String,
  stock: Number
});

module.exports = mongoose.model('Product', ProductSchema);