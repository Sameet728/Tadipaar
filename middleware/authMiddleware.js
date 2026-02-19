const jwt = require("jsonwebtoken");

// ✅ verify token (common)
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// ✅ admin only
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin access required" });
  }
  next();
};

// ✅ criminal only
exports.isCriminal = (req, res, next) => {
  // optional debug (remove in production)
  console.log("User role:", req.user.role);

  if (!req.user || req.user.role !== "criminal") {
    return res.status(403).json({ msg: "Criminal access required" });
  }
  next();
};
