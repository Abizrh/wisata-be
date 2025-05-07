const { default: mongoose } = require("mongoose");
const Booking = require("../models/Booking");
const Destinasi = require("../models/Destinasi");
const Guide = require("../models/Guide");
const OrderGuide = require("../models/OrderGuide");

// @desc    Get all bookings
// @route   GET /api/booking
// @access  Private/Admin
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("destinasi", "name price");

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/booking/myBookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "destinasi",
    );

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/booking/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("destinasi");

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure user is owner or admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new booking
// @route   POST /api/booking
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { destinasiId, startDate, endDate } = req.body;

    // Check if destinasi exists
    // this destination will forward msg or notification to guide

    const id = new mongoose.Types.ObjectId(destinasiId);
    const destinasi = await Destinasi.findById(destinasiId);
    if (!destinasi) {
      return res.status(404).json({
        success: false,
        message: "Destinasi not found",
      });
    }

    // Check if guide exists
    const guide = await Guide.findById(destinasi.guide_id);
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    // order guide

    // Calculate total price based on duration
    // const start = new Date(startDate);
    // const end = new Date(endDate);
    // const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // in days
    //
    // if (duration < 1) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "End date must be after start date",
    //   });
    // }

    const totalPrice = destinasi.price;

    const booking = await Booking.create({
      user: req.user._id,
      destinasi: destinasiId,
      paymentStatus: "paid",
      startDate,
      endDate,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });

    const order = await OrderGuide.create({
      guide: guide._id,
      booking: booking._id,
      traveler: req.user._id,
      destination: destinasi._id,
      status: "pending",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not created",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/booking/:id
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/booking/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Only allow cancellation if status is pending or confirmed
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`,
      });
    }

    booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      {
        new: true,
      },
    );

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
