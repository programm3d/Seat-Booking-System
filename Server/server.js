const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./Routes/user.route");
const seatRouter = require("./Routes/seat.route");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: "https://tranquil-boba-425d35.netlify.app", 
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/user", userRouter);
app.use("/seat", seatRouter);

app.use((req, res) => {
  res.status(404).send({ msg: "Undefined Route" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
