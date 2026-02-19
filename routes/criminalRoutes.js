const express = require("express");
const router = express.Router();
const {
  verifyToken,
  isAdmin,
  isCriminal,
  
} = require("../middleware/authMiddleware");

const {
  addCriminal,
  getCriminals,
  getCriminalById,
  updateCriminal,
  deleteCriminal,
  criminalLogin,
  getMyProfile
} = require("../controllers/criminalController");

// 🔐 admin
router.post("/add", verifyToken, isAdmin, addCriminal);
router.get("/", verifyToken, isAdmin, getCriminals);
router.get("/:id", verifyToken, isAdmin, getCriminalById);
router.put("/:id", verifyToken, isAdmin, updateCriminal);
router.delete("/:id", verifyToken, isAdmin, deleteCriminal);


// 🔐 criminal
router.post("/login", criminalLogin);


// router.get("/me", verifyToken, isCriminal, getMyProfile);


module.exports = router;

