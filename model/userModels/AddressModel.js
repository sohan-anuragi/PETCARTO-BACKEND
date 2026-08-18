const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNo: {
      type: String,
      required: true,
    },

    pinCode: {
      type: String,
      required: true,
    },

    houseNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    locality: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    addressType: {
      type: String,
      enum: ["Home", "Office"],
      default: "Home",
    },

    openOnSaturday: {
      type: Boolean,
      default: false,
    },

    openOnSunday: {
      type: Boolean,
      default: false,
    },

    makeDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Address", AddressSchema);
