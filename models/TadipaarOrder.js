const mongoose = require("mongoose");

const tadipaarOrderSchema = new mongoose.Schema(
  {
    criminalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Criminal",
      required: true,
    },

    crimeType: String,

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    restrictedAreaIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TadipaarOrder", tadipaarOrderSchema);
