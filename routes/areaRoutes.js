const express = require("express");
const router = express.Router();

const { addArea } = require("../controllers/areaController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// 🔐 Admin only
router.post("/add", verifyToken, isAdmin, addArea);

module.exports = router;
