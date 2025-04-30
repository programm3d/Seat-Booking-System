const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true, unique: true },
  row: { type: Number, required: true },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  status: {
    type: String,
    enum: ["available", "reserved"],
    default: "available",
  },
});


const seatModel = mongoose.model("Seat", seatSchema);
module.exports = seatModel;