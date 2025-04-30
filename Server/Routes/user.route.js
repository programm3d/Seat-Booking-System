const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../Middleware/authMiddleware")
const userModel = require("../Models/user.model");

const userRouter = express.Router();

userRouter.post("/sign-up", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let hashedPass = bcrypt.hashSync(password, 10);
    const user = await userModel.create({ name, email, password: hashedPass });
    res.status(201).json({ msg: "User Created", user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).send({ message: "User Not Found" });
    let hashedPass = user.password;
    await bcrypt.compare(password, hashedPass, (err, result) => {
      if (err) return res.status(500).send({ message: err.message });
      if (result) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return res.status(200).send({ message: "Login successful", token, user});
      } else {
        return res.status(400).send({ message: "Wrong Password" });
      }
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

userRouter.get("/profile", authMiddleware() , async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).send({ message: "User Not Found" });
    res.status(200).send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

module.exports = userRouter;
