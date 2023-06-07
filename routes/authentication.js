const express = require("express");
const router = express.Router();
const User = require("../models/users");
require("dotenv").config();

router.get("/user", async (req, res) => {
  const user = await User.find({ uid: req.query.uid });
  if (user.length === 0) {
    const newUser = new User({
      username: req.query.displayName,
      email: req.query.email,
      uid: req.query.uid,
      imageUrl: req.query.photoURL,
    });
    await newUser.save();
  } else {
    res.send(user);
  }
});

module.exports = router;
