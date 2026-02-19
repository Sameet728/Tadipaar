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
  getMyProfile,
  getAllCriminals
} = require("../controllers/criminalController");

// 🔐 admin
router.get(
  "/all",
  verifyToken,
  isAdmin,
  getAllCriminals
);
router.post("/add", verifyToken, isAdmin, addCriminal);
router.get("/", verifyToken, isAdmin, getCriminals);
router.put("/:id", verifyToken, isAdmin, updateCriminal);
router.delete("/:id", verifyToken, isAdmin, deleteCriminal);


// 🔐 criminal
router.post("/login", criminalLogin);
router.get("/:id", verifyToken, getCriminalById);


router.get("/me",  getMyProfile);





module.exports = router;
