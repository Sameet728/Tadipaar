const express = require("express");
const router = express.Router();

const {
  checkIn,
  getRecordsByCriminal,
} = require("../controllers/tadipaarController");

const {
  verifyToken,
  isCriminal,
  isAdmin,
} = require("../middleware/authMiddleware");

// 🚶 Criminal daily check-in
const upload = require("../middleware/upload");

router.post(
  "/checkin",
  verifyToken,
  isCriminal,
  upload.single("selfie"),
  checkIn
);


// 👮 Admin view records
router.get("/criminal/:criminalId", verifyToken, isAdmin, getRecordsByCriminal);

module.exports = router;
