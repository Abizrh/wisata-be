const Guide = require("../models/Guide");
const OrderGuide = require("../models/OrderGuide");
const Booking = require("../models/Booking");

// @desc    Get all destinasi
// @route   GET /api/destinasi
// @access  Public
exports.getGuide = async (req, res) => {
  try {
    const destinasi = await Guide.find();
    res.json({
      success: true,
      count: destinasi.length,
      data: destinasi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single destinasi
// @route   GET /api/destinasi/:id
// @access  Public
exports.getGuideById = async (req, res) => {
  try {
    const destinasi = await Guide.findById(req.params.id);

    if (!destinasi) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    res.json({
      success: true,
      data: destinasi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new destinasi
// @route   POST /api/destinasi
// @access  Private/Pengelola/Admin
exports.createGuide = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;

    const destinasi = await Guide.create(req.body);

    res.status(201).json({
      success: true,
      data: destinasi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new destinasi
// @route   POST /api/destinasi
// @access  Private/Pengelola/Admin
exports.createGuideOrder = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;

    const destinasi = await Guide.create(req.body);

    res.status(201).json({
      success: true,
      data: destinasi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update destinasi
// @route   PUT /api/destinasi/:id
// @access  Private/Pengelola/Admin
exports.updateGuide = async (req, res) => {
  try {
    let destinasi = await Guide.findById(req.params.id);

    if (!destinasi) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    // Make sure user is the creator or an admin
    if (
      destinasi.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this destinasi",
      });
    }

    destinasi = await Guide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: destinasi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete destinasi
// @route   DELETE /api/destinasi/:id
// @access  Private/Pengelola/Admin
exports.deleteGuide = async (req, res) => {
  try {
    const destinasi = await Guide.findById(req.params.id);

    if (!destinasi) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    // Make sure user is the creator or an admin
    if (
      destinasi.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this destinasi",
      });
    }

    await destinasi.deleteOne();

    res.json({
      success: true,
      message: "Guide removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all order guide
// @route   GET /api/order-guide
// @access  Private
// .populate("booking")
// .populate("guide");
exports.getOrderGuide = async (req, res) => {
  try {
    const orderGuide = await OrderGuide.find()
      .populate("booking", "_id totalPrice")
      .populate("traveler", "name email")
      .populate("destination", "name price");

    res.json({
      success: true,
      count: orderGuide.length,
      data: orderGuide,
    });
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
exports.updateGuideOrderStatus = async (req, res) => {
  try {
    // const { status } = req.body;

    let booking = await OrderGuide.findById(req.params.id);
    let status = req.params.status;
    console.log(status, booking);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking = await OrderGuide.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    console.log("booking", booking);
    // update user booking status to confirmed
    const updateBooking = await Booking.findByIdAndUpdate(booking.booking, {
      status: "confirmed",
      paymentStatus: "paid",
      updatedAt: new Date(),
      updatedBy: req.user,
    });

    if (!updateBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
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
