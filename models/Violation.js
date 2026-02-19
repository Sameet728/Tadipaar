const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
  criminalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Criminal",
  },
  detectedLat: Number,
  detectedLng: Number,
  status: { type: String, default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Violation", violationSchema);
