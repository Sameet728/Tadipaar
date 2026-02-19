const express = require("express");
const router = express.Router();

const {
  addRestrictedArea,
  getAreasByCriminal,
  deleteRestrictedArea,
} = require("../controllers/restrictedAreaController");

const {
  verifyToken,
  isAdmin,
} = require("../middleware/authMiddleware");


// 🔐 Admin only
router.post("/add", verifyToken, isAdmin, addRestrictedArea);
router.get("/criminal/:criminalId", verifyToken, isAdmin, getAreasByCriminal);
router.delete("/:id", verifyToken, isAdmin, deleteRestrictedArea);

module.exports = router;
