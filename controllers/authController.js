const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, admin });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Admin Register
exports.adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      msg: "Admin registered successfully",
      admin,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
