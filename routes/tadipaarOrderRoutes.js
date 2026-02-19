const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrdersByCriminal,
  updateOrderStatus,
  getMyActiveOrder,
  getCriminalOrders,
} = require("../controllers/tadipaarOrderController");

const {
  verifyToken,
  isAdmin,
  isCriminal,
} = require("../middleware/authMiddleware");

// 👮 Admin
router.post("/create", verifyToken, isAdmin, createOrder);
router.get("/criminal/:criminalId", verifyToken, getOrdersByCriminal);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

// 🚶 Criminal
router.get("/my-active", verifyToken, isCriminal, getMyActiveOrder);





module.exports = router;
