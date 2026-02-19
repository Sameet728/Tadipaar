const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema(
  {
    areaName: { type: String, required: true },
    latitude: Number,
    longitude: Number,
    radiusKm: Number,
  },
  { timestamps: true }
);

// 🔥 prevent duplicate areas
areaSchema.index(
  { areaName: 1, latitude: 1, longitude: 1 },
  { unique: true }
);

module.exports = mongoose.model("Area", areaSchema);
