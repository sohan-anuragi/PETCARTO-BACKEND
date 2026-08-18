//EXTERNAL MODEL
const mongoose = require("mongoose");

// USER SIGN-UP SCHEMA
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);
