const express = require("express");
const router = express.Router();
const {
  getGuide,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide,
  getOrderGuide,
  updateGuideOrderStatus,
} = require("../controllers/guideController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.route("/order").get(getOrderGuide);
router.route("/order/:id/:status").patch(updateGuideOrderStatus);
router.route("/").get(getGuide);
router.route("/:id").get(getGuideById);

// Protected routes
router.use(protect);

// Only pemandu and admin can create/update/delete
router.route("/").post(authorize("pemandu", "admin"), createGuide);

router
  .route("/:id")
  .put(authorize("pemandu", "admin"), updateGuide)
  .delete(authorize("pemandu", "admin"), deleteGuide);

module.exports = router;
