const mongoose = require("mongoose");

const criminalSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    gender: String,
    phone: { type: String, unique: true },

    loginId: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: ["criminal"],
      default: "criminal",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Criminal", criminalSchema);
