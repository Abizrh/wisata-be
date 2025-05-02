const express = require('express');
const router = express.Router();
const {
  getBookings,
  getMyBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createBooking);

router.route('/myBookings')
  .get(getMyBookings);

router.route('/:id')
  .get(getBookingById);

router.route('/:id/cancel')
  .put(cancelBooking);

// Admin only routes
router.route('/')
  .get(authorize('admin'), getBookings);

router.route('/:id')
  .put(authorize('admin'), updateBookingStatus);

module.exports = router;