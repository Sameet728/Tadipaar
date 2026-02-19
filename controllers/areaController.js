const Area = require("../models/Area");

// ✅ Admin — create area only if not exists
exports.addArea = async (req, res) => {
  try {
    const { areaName, latitude, longitude, radiusKm } = req.body;

    // 🔥 check existing
    let area = await Area.findOne({
      areaName,
      latitude,
      longitude,
    });

    if (area) {
      return res.status(200).json({
        msg: "Area already exists",
        area,
      });
    }

    // create new
    area = await Area.create({
      areaName,
      latitude,
      longitude,
      radiusKm,
    });

    res.status(201).json({
      msg: "Area created successfully",
      area,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find().sort({ createdAt: -1 });

    res.json({
      count: areas.length,
      areas,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
