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
  stock: Number,
  featured: { type: Boolean, default: false },
  new: { type: Boolean, default: false },
  topSellers: { type: Boolean, default: false },
  onSale: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  bgColor: String,
  label: String,
  labelColor: String,
  id: Number
}, { id: false });

module.exports = mongoose.model('Product', ProductSchema);