const express = require("express");
const seatModel = require("../Models/seats.model");
const authMiddleware = require("../Middleware/authMiddleware");

const seatRouter = express.Router();

seatRouter.post("/book", authMiddleware, async (req, res) => {
  try {
    const { seatNumbers } = req.body;
    const userId = req.userId;

    const seats = await seatModel.find({
      seatNumber: { $in: seatNumbers },
      status: "available",
    });

    if (seats.length !== seatNumbers.length) {
      return res
        .status(400)
        .json({ msg: "Some seats are already reserved or invalid" });
    }

    await seatModel.updateMany(
      { seatNumber: { $in: seatNumbers } },
      { $set: { reservedBy: userId, status: "reserved" } }
    );

    const bookedSeatIds = seats.map((seat) => seat._id);

    await userModel.findByIdAndUpdate(userId, {
      $push: { bookings: { $each: bookedSeatIds } },
    });

    res
      .status(200)
      .json({ msg: "Seats booked successfully", bookedSeats: seatNumbers });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

seatRouter.post("/reset-booking", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "No user found" });
    }

    if (user.bookings.length === 0) {
      return res.status(400).json({ msg: "No bookings found to reset" });
    }

    await seatModel.updateMany(
      { _id: { $in: user.bookings } },
      { $set: { reservedBy: null, status: "available" } }
    );

    await userModel.findByIdAndUpdate(userId, { $set: { bookings: [] } });

    res.status(200).json({ msg: "All bookings have been reset successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

module.exports = seatRouter;
