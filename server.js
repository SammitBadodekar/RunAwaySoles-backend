const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const UserModel = require("./models/users");
const cors = require("cors");
const shoesRouter = require("./routes/getShoes");
const authentication = require("./routes/authentication");

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);
app.use("/getShoes", shoesRouter);
app.use("/auth", authentication);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

mongoose.connect(process.env.MONGO_KEY);
app.get("/getUsers", (req, res) => {
  UserModel.find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/users/:id/cartItems", (req, res) => {
  const userId = req.params.id;
  UserModel.find({ _id: userId }, "cart")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.put("/users/:id/updateCartItems", async (req, res) => {
  const updatedCart = req.body;
  const userId = req.params.id;

  const filter = { _id: userId };
  const update = { $set: { cart: updatedCart } };

  await UserModel.updateOne(filter, update);

  res.send(userId);
});
