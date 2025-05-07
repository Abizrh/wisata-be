const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destinasi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destinasi",
    required: true,
  },
  startDate: {
    type: Date,
    // required: true
  },
  endDate: {
    type: Date,
    // required: true
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
    // note: pending when booking is created by wisatawan, confirmed when booking is confirmed by guide and
    // paid when payment is made by wisatawan at the end of the trip
    // completed when booking is done by wisatawan
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
    // note: unpaid when booking is created by wisatawan, paid when payment is made by wisatawan at the end of the trip
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);

