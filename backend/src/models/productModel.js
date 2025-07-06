const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //reference to the user model
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true, //remove spaces from both sides of the string
      maxLength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
      type: Number,
      maxLength: [5, "Product price cannot exceed 5 characters"],
      default: 0.0,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        image: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true, // Cloudinary public ID for deletion
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please select category for this product"],
      enum: {
        // enum is a list of possible values
        values: [
          "Electronics",
          "MobilePhones",
          "Cameras",
          "Laptops",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Clothes/Shoes",
          "Beauty/Health",
          "Sports",
          "Outdoor",
          "HomeAppliances",
        ],
        message: "Please select correct category for this product",
      },
    },
    seller: {
      // product sell panravanga
      type: String,
      required: [true, "Please enter product seller"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxLength: [20, "Product stock cannot exceed 20 characters"],
      default: 0,
    },
    numOfReviews: {
      // total number of reviews
      type: Number,
      default: 0,
    },
    reviews: [
      // all reviews
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
