const express = require("express");
const router = express.Router();
const {
  adminLogin,
  adminRegister,
} = require("../controllers/authController");

router.post("/admin-register", adminRegister); // ⭐ NEW
router.post("/admin-login", adminLogin);

module.exports = router;
