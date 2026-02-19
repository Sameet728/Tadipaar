const mongoose = require("mongoose");

const restrictedAreaSchema = new mongoose.Schema(
  {
    criminalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Criminal",
      required: true,
    },

    areaName: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    radiusKm: {
      type: Number,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RestrictedArea", restrictedAreaSchema);
