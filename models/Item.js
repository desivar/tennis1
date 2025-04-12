const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number },
  category: { type: String },
  manufacturer: { type: String },
  releaseDate: { type: Date },
  isAvailable: { type: Boolean }
});

module.exports = mongoose.model('Item', ItemSchema);