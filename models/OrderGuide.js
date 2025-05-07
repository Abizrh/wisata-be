const mongoose = require("mongoose");

const OrderGuideSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
    // note: pending when booking is created by wisatawan, confirmed when booking is confirmed by guide and
    // paid when payment is made by wisatawan at the end of the trip
    // completed when booking is done by wisatawan
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
    required: true,
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destinasi",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("OrderGuide", OrderGuideSchema);
