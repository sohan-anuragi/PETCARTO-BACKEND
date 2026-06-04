// ===================================================================
// PRODUCT SCHEMA - MONGODB MODEL FOR PET CARTO
// ===================================================================

const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    // BASIC INFORMATION FIELDS
    title: { type: String, required: true },
    description: String,
    slug: { type: String, unique: true },

    // CATEGORIZATION FIELDS
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },

    category: { type: String, required: true },
    subCategory: String,
    brand: String,

    // IMAGE FIELDS
    images: [String],

    // INVENTORY AND RATINGS
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    // STATUS AND FEATURES
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    highlight: String,

    // PRODUCT SPECIFICATIONS
    size: String,
    color: String,
    weight: Number,
    ram: String,

    // ===================================================================
    // NEW TECHNICAL DETAILS (ADDED)
    // ===================================================================

    pattern: String,
    finishType: String,
    itemWeight: String,
    productCareInstructions: String,
    isMicrowaveable: Boolean,
    numberOfPieces: Number,
    manufacturer: String,
    itemModelNumber: String,
    asin: String,
  },
  { timestamps: true },
);

// EXPORT MODEL
module.exports = mongoose.model("Product", productSchema);
