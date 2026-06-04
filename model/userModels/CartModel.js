//EXTERNAL MODULES
const mongoose = require("mongoose");

const CartListSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cartProducts: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("CartList", CartListSchema);
