const express = require("express");
const router = express.Router();

const { addArea, getAllAreas } = require("../controllers/areaController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// 🔐 Admin only
router.post("/add", verifyToken, isAdmin, addArea);
router.get(
  "/all",
  verifyToken,
  isAdmin,
  getAllAreas
);


module.exports = router;
