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

    date: {
      type: Date,
      required: true,
    },

    selfieUrl: {
      type: String,
    },

    latitude: Number,
    longitude: Number,

    status: {
      type: String,
      enum: ["compliant", "location_violation", "not_reported"],
      default: "compliant",
    },

    violationReason: String,
  },
  { timestamps: true }
);

// 🔥 prevent duplicate per day per order
tadipaarRecordSchema.index(
  { orderId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("TadipaarRecord", tadipaarRecordSchema);
