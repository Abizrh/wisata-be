const mongoose = require("mongoose");

const DestinasiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  guide_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
  },
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 1,
  },
  includes: [{ type: String }],
  facilities: [{ type: String }],
  description: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Destinasi", DestinasiSchema);
