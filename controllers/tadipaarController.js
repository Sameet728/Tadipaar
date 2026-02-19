const TadipaarRecord = require("../models/TadipaarRecord");
const TadipaarOrder = require("../models/TadipaarOrder");
const Area = require("../models/Area");
const { getDistanceKm } = require("../utils/geoUtils");

exports.checkIn = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const criminalId = req.user.id;

    // ✅ file from multer
    const selfieUrl = req.file?.path;

    if (!selfieUrl) {
      return res.status(400).json({
        msg: "Selfie image is required",
      });
    }

    // ✅ active order
    const order = await TadipaarOrder.findOne({
      criminalId,
      status: "active",
    });

    if (!order) {
      return res.status(400).json({
        msg: "No active tadipaar order",
      });
    }

    // ✅ get restricted areas
    const areas = await Area.find({
      _id: { $in: order.restrictedAreaIds },
    });

    let violation = false;
    let violationReason = "";

    for (const area of areas) {
      const distance = getDistanceKm(
        Number(latitude),
        Number(longitude),
        area.latitude,
        area.longitude
      );

      if (distance <= area.radiusKm) {
        violation = true;
        violationReason = `Inside restricted area: ${area.areaName}`;
        break;
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const status = violation ? "location_violation" : "compliant";

    const record = await TadipaarRecord.create({
      orderId: order._id,
      criminalId,
      date: today,
      selfieUrl,
      latitude,
      longitude,
      status,
      violationReason,
    });

    res.status(201).json({
      msg: violation
        ? "Location violation detected"
        : "Check-in compliant",
      status,
      record,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        msg: "Today's check-in already submitted",
      });
    }
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Admin — view records of criminal
exports.getRecordsByCriminal = async (req, res) => {
  try {
    const records = await TadipaarRecord.find({
      criminalId: req.params.criminalId,
    }).sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
