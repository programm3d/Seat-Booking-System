const express = require("express");
const seatModel = require("../Models/seats.model");
const authMiddleware = require("../Middleware/authMiddleware");
const userModel = require("../Models/user.model");

const seatRouter = express.Router();

seatRouter.post("/book", authMiddleware(), async (req, res) => {
  try {
    const { seatNumbers } = req.body;
    const userId = req.userId;
    await seatModel.updateMany(
      { seatNumber: { $in: seatNumbers } },
      { $set: { reservedBy: userId, status: "reserved" } }
    );

    const seats = await seatModel.find({ seatNumber: { $in: seatNumbers } });
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

seatRouter.post("/reset-booking", authMiddleware(), async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    let user;
    try {
      user = await userModel.findById(userId);
    } catch (queryError) {
      console.error("Error fetching user:", queryError);
      return res.status(500).json({ msg: "Failed to fetch user" });
    }

    if (!user) {
      return res.status(400).json({ msg: "No user found" });
    }

    if (user.bookings.length === 0) {
      return res.status(400).json({ msg: "No bookings found to reset" });
    }

    try {
      await seatModel.updateMany(
        { _id: { $in: user.bookings } },
        { $set: { reservedBy: null, status: "available" } }
      );

      await userModel.findByIdAndUpdate(userId, { $set: { bookings: [] } });
      console.log(userId);

      res
        .status(200)
        .json({ msg: "All bookings have been reset successfully" });
    } catch (updateError) {
      console.error("Error updating bookings:", updateError);
      return res.status(500).json({ msg: "Failed to reset bookings" });
    }
  } catch (error) {
    console.error("Unexpected server error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

seatRouter.get("/all-seats", authMiddleware(), async (req, res) => {
  try {
    const seats = await seatModel.find({});
    res.status(200).json(seats);
  } catch (error) {
    console.error("❌ Error fetching seats:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

module.exports = seatRouter;
