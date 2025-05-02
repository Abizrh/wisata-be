const mongoose = require('mongoose');

const DestinasiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  images: [String],
  category: {
    type: String,
    required: true,
    enum: ['pantai', 'gunung', 'budaya', 'alam', 'kuliner', 'lainnya']
  },
  facilities: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Destinasi', DestinasiSchema);