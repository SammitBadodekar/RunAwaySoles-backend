const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const router = express.Router();
const User = require("../models/users");
require("dotenv").config();

router.use(
  cookieSession({
    name: "session",
    keys: ["authenticate"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
router.use(passport.initialize());
router.use(passport.session());

let userGoogleId = "";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await User.find({ google_id: profile.id });
      console.log(user);
      if (user.length === 0) {
        const newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          google_id: profile.id,
          imageUrl: profile.photos[0].value,
        });

        userGoogleId = profile.id;
        await newUser.save();
        return done(null, user);
      } else {
        userGoogleId = user[0].google_id;
        return done(null, user);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/login",
    failureRedirect: "http://localhost:5173/login/failed",
  })
);

router.get("/login/success", (req, res) => {
  console.log(req.user);
  res.json(req.user);
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

module.exports = router;
