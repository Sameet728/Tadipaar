const express = require("express");
const router = express.Router();

const {
  checkIn,
  getRecordsByCriminal,
  getMyRestrictedAreas,
  getCriminalRecords,
  getAllViolations,
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

router.get(
  "/my-areas",
  verifyToken,
  isCriminal,
  getMyRestrictedAreas
);

router.get(
  "/records/:criminalId",
  verifyToken,
  getCriminalRecords
);
router.get(
  "/violations",
  verifyToken,
  isAdmin,
  getAllViolations
);



// 👮 Admin view records
router.get("/criminal/:criminalId", verifyToken, isAdmin, getRecordsByCriminal);

module.exports = router;
