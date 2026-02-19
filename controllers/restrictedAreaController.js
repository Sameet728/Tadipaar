const RestrictedArea = require("../models/RestrictedArea");
const Criminal = require("../models/Criminal");


// ✅ Admin — Add restricted area to criminal
exports.addRestrictedArea = async (req, res) => {
  try {
    const { criminalId, areaName, latitude, longitude, radiusKm } = req.body;

    // check criminal exists
    const criminal = await Criminal.findById(criminalId);
    if (!criminal) {
      return res.status(404).json({ msg: "Criminal not found" });
    }

    const area = await RestrictedArea.create({
      criminalId,
      areaName,
      latitude,
      longitude,
      radiusKm,
    });

    res.status(201).json({
      msg: "Restricted area added",
      area,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Admin — Get areas of a criminal
exports.getAreasByCriminal = async (req, res) => {
  try {
    const areas = await RestrictedArea.find({
      criminalId: req.params.criminalId,
      active: true,
    });

    res.json(areas);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


// ✅ Admin — Delete area
exports.deleteRestrictedArea = async (req, res) => {
  try {
    await RestrictedArea.findByIdAndDelete(req.params.id);
    res.json({ msg: "Restricted area removed" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
