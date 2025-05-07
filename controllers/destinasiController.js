const Destinasi = require("../models/Destinasi");

// @desc    Get all destinasi
// @route   GET /api/destinasi
// @access  Public
exports.getDestinasi = async (req, res) => {
  try {
    const destinasi = await Destinasi.find();
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
exports.getDestinasiById = async (req, res) => {
  try {
    const destinasi = await Destinasi.findById(req.params.id);

    if (!destinasi) {
      return res.status(404).json({
        success: false,
        message: "Destinasi not found",
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
exports.createDestinasi = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;

    req.body.manager_id = req.user._id;
    const destinasi = await Destinasi.create(req.body);

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
exports.updateDestinasi = async (req, res) => {
  try {
    let destinasi = await Destinasi.findById(req.params.id);

    if (!destinasi) {
      return res.status(404).json({
        success: false,
        message: "Destinasi not found",
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

    destinasi = await Destinasi.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteDestinasi = async (req, res) => {
  try {
    const destinasi = await Destinasi.findById(req.params.id);

    if (!destinasi) {
      return res.status(404).json({
        success: false,
        message: "Destinasi not found",
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
      message: "Destinasi removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

