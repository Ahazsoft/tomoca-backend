const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  parent: String,
  img: String,
  type: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: false },
  toObject: { virtuals: false },
  id: false
});

module.exports = mongoose.model('Category', CategorySchema);
