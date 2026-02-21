const mongoose = require("mongoose");

const tadipaarRecordSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TadipaarOrder",
      required: true,
      index: true,
    },

    criminalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Criminal",
      required: true,
      index: true,
    },

    // ✅ full timestamp (NOT start of day)
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },

    selfieUrl: {
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

    status: {
      type: String,
      enum: ["compliant", "location_violation", "not_reported"],
      default: "compliant",
      index: true,
    },

    violationReason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🚀 performance indexes (IMPORTANT for scaling)
tadipaarRecordSchema.index({ criminalId: 1, createdAt: -1 });
tadipaarRecordSchema.index({ orderId: 1, createdAt: -1 });

module.exports = mongoose.model("TadipaarRecord", tadipaarRecordSchema);
