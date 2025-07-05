const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    index: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  available: {
    type: Boolean,
    default: true,
    index: true
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, available: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 