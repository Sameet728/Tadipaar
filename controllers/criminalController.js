const Criminal = require("../models/Criminal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateLoginId = (phone) => {
  const phoneStr = phone.toString();
  return "CR" + phoneStr.slice(-6);
};

const generatePassword = (name, phone) => {
  const phoneStr = phone.toString();
  return name.slice(0, 3) + phoneStr.slice(-4);
};


// ✅ ADMIN — Add Criminal
exports.addCriminal = async (req, res) => {
  try {
    const { name, age, gender, phone } = req.body;

    // basic validation
    if (!name || !phone) {
      return res.status(400).json({
        msg: "Name and phone are required",
      });
    }

    // check existing
    const exists = await Criminal.findOne({ phone });
    if (exists) {
      return res.status(400).json({ msg: "Criminal already exists" });
    }

    // 🔐 auto credentials
    const loginId = generateLoginId(phone);
    const rawPassword = generatePassword(name, phone);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const criminal = await Criminal.create({
      name,
      age,
      gender,
      phone,
      loginId,
      password: hashedPassword,
    });

    res.status(201).json({
      msg: "Criminal added successfully",
      loginId,
      tempPassword: rawPassword, // show once to admin
      criminal,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ ADMIN — Get all criminals
exports.getCriminals = async (req, res) => {
  try {
    const criminals = await Criminal.find().sort({ createdAt: -1 });
    res.json(criminals);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ ADMIN — Get single criminal
exports.getCriminalById = async (req, res) => {
  try {
    const criminal = await Criminal.findById(req.params.id);
    res.json(criminal);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ ADMIN — Update criminal
exports.updateCriminal = async (req, res) => {
  try {
    const updated = await Criminal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ ADMIN — Delete criminal
exports.deleteCriminal = async (req, res) => {
  try {
    await Criminal.findByIdAndDelete(req.params.id);
    res.json({ msg: "Criminal deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 🔐 CRIMINAL LOGIN
exports.criminalLogin = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const criminal = await Criminal.findOne({ loginId });
    if (!criminal) {
      return res.status(404).json({ msg: "Invalid ID" });
    }

    const isMatch = await bcrypt.compare(password, criminal.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: criminal._id, role: "criminal" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, criminal });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Criminal — get own profile
exports.getMyProfile = async (req, res) => {
  try {
    const criminal = await Criminal.findById(req.user.id).select("-password");
    res.json(criminal);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
