const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  cart: {
    type: Array,
  },
  email: {
    type: String,
  },
  google_id: {
    type: String,
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
