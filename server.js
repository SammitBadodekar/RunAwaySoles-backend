const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const UserModel = require("./models/users");
const nodemailer = require("nodemailer");
const cors = require("cors");
const shoesRouter = require("./routes/getShoes");
const authentication = require("./routes/authentication");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

app.use(express.json());
mongoose.connect(
  `mongodb+srv://sammitbadodekar:${process.env.MONGO_KEY}@cluster0.rnwqbdp.mongodb.net/RunAwaySoles?retryWrites=true&w=majority`
);
app.use(
  cors({
    origin: "https://run-away-soles.vercel.app",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://run-away-soles.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.use("/getShoes", shoesRouter);
app.use("/auth", authentication);
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.post("/create-checkout-session", async (req, res) => {
  const lineItems = await Promise.all(
    req.body.map(async (item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.img],
          },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      };
    })
  );
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${"https://run-away-soles.vercel.app/success"}`,
      cancel_url: `${"https://run-away-soles.vercel.app/cart"}`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e.message);
  }
});

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
  UserModel.find({ uid: userId }, "cart")
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
app.get("/users/:id/orders", (req, res) => {
  const userId = req.params.id;
  UserModel.find({ uid: userId }, "orders")
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

  const filter = { uid: userId };
  const update = { $set: { cart: updatedCart } };

  await UserModel.updateOne(filter, update);

  res.send(userId);
});
app.put("/users/:id/updateOrders", async (req, res) => {
  const updatedOrders = req.body;
  const userId = req.params.id;

  const filter = { uid: userId };
  const update = { $set: { orders: updatedOrders } };

  await UserModel.updateOne(filter, update);

  res.send(userId);
});

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "run-away-soles@outlook.com",
    pass: process.env.NODEMAILER_EMAIL_PASSWORD,
  },
});

app.get("/:id/ordersuccess", async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  if (userId) {
    const user = await UserModel.find({ uid: userId });
    const options = {
      from: "run-away-soles@outlook.com",
      to: `${user.email}`,
      subject: "Order Successful",
      text: `Haha , you thought you will get real shoes LOL!!!`,
    };
    transporter.sendMail(options, (error, res) => {
      if (error) {
        console.log(error);
      }
      console.log("sent mail");
      res.send(userId);
    });
  }
  res.send("invalid user");
});
