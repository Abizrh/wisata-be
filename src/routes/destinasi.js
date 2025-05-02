const express = require('express');
const router = express.Router();
const {
  getDestinasi,
  getDestinasiById,
  createDestinasi,
  updateDestinasi,
  deleteDestinasi
} = require('../controllers/destinasiController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getDestinasi);
router.route('/:id').get(getDestinasiById);

// Protected routes
router.use(protect);

// Only pengelola and admin can create/update/delete
router.route('/')
  .post(authorize('pengelola', 'admin'), createDestinasi);

router.route('/:id')
  .put(authorize('pengelola', 'admin'), updateDestinasi)
  .delete(authorize('pengelola', 'admin'), deleteDestinasi);

module.exports = router;