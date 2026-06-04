//EXTERNAL MODULE
const mongoose = require("mongoose");

// WISHLIST SCHEMA USER SPECIFIC
const wishListSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Product",
    required: true,
  },
});

module.exports = mongoose.model("WishList", wishListSchema);
