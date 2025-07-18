const Product = require("../models/productModel.js");
const asyncHandler = require("express-async-handler");
const ApiFeautures = require("../../Utils/apiFeautures.js");
const cloudinary = require("../../config/cloudinaryConfig.js");
const dotenv = require("dotenv");

dotenv.config();
const fs = require("fs");

//Create product
//POST - /api/products/create

const createProduct = asyncHandler(async (req, res) => {
  let images = [];
  if (req.files.length > 0) {
    req.files.forEach((file) => {
      // let url = `${process.env.BACKEND_URL}/uploads/products/${file.filename}`;
       let url = file.path; 
      images.push({ image: url, public_id: file.filename });
    });
  }

  // images filed ku images array ah asign panrom
  req.body.images = images;
  req.body.user = req.user.id; // user id add pannanum ithu token la irunthu id ah access panrom
  const product = await Product.create(req.body);

  res
    .status(201)
    .json({ success: true, message: "Product created successfully", product });
});

//Get products
//GET - /api/products/get

const getProducts = asyncHandler(async (req, res, next) => {
  const resultPerPage = 7;

  // Step 1: Create an ApiFeatures instance for filtering/searching
  const apiFeature = new ApiFeautures(Product.find(), req.query)
    .search()
    .filter();

  // Step 2: Clone the query and get filtered count before pagination
  const filteredProductsCount = await apiFeature.query.clone().countDocuments(); //countDocuments() na total ethana products irukku nu count pannum — but pagination apply pannadhadhaan count aaganum.
  // apifeautures.query - product.find()
  // Step 3: Apply pagination
  apiFeature.paginate(resultPerPage);

  // Step 4: Execute the final query
  const products = await apiFeature.query;

  // Optional: only send error if search/filter/pagination is valid and still returns empty
  if (products.length === 0 && filteredProductsCount > 0) {
    return next(new Error("No products found on this page"));
  }

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    count: filteredProductsCount,
    resultPerPage,
    products,
  });
});

//Get single product
//GET - /api/products/get/:id

const getSingleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("Product not found"));
  }
  res.status(200).json({ success: true, product });
});

//Update product
//PUT - /api/products/update/:id

const updateProduct = asyncHandler(async (req, res) => {
  // 🔍 Step 1: Get product from DB using ID
  const product = await Product.findById(req.params.id);

  if (!product) {
    // ❌ If product not found, send 404 response
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // 🧾 Step 2: Get oldImages list from frontend (string → array)
  let oldImagesToKeep = [];
  if (req.body.oldImages) {
    try {
      oldImagesToKeep = JSON.parse(req.body.oldImages); // string → array
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid oldImages format",
      });
    }
  }

  // 🗑️ Step 3: Find images that were removed by user (not in oldImagesToKeep)
  const removedImages = product.images.filter(
    (img) =>
      !oldImagesToKeep.includes(img._id?.toString()) && // _id comparison
      !oldImagesToKeep.includes(img.image)              // URL comparison
  );

  // 🔥 Step 4: Delete removed images from Cloudinary using their public_id
  for (const img of removedImages) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id); // ✅ Delete from Cloudinary
    }
  }

  // 🖼️ Step 5: Keep only the old images that user selected to retain
  let updatedImages = product.images.filter(
    (img) =>
      oldImagesToKeep.includes(img._id?.toString()) ||
      oldImagesToKeep.includes(img.image)
  );

  // 🆕 Step 6: Add newly uploaded images (from req.files) to updatedImages
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      updatedImages.push({
        image: file.path,        // ✅ Cloudinary URL
        public_id: file.filename // ✅ Needed for deleting later
      });
    });
  }

  // 📦 Step 7: Assign final image list to req.body for DB update
  req.body.images = updatedImages;

  // 🛠️ Step 8: Update the product with new data
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,               // return the updated product
    runValidators: true,     // apply Mongoose validation
    useFindAndModify: false, // use modern Mongo driver
  });

  // ✅ Step 9: Send updated product as response
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

//Delete product
//DELETE - /api/products/delete/:id
// const deleteSingleProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findByIdAndDelete(req.params.id);
//   if (!product) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Product not found" });
//   }
//   res
//     .status(200)
//     .json({ success: true, message: "Product deleted successfully" });
// });

//Create Review
//PUT - /api/products/review

const createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  // Step 1: Get the product
  const product = await Product.findById(productId);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Step 2: Create review object
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  // Step 3: Check if the user has already reviewed the product
  const isReviewed = product.reviews.find(
    (rev) => rev.user?.toString() === req.user?._id?.toString()
  );

  // Step 4: Update or Push Review
  if (isReviewed) {
    product.reviews = product.reviews.map((rev) => {
      if (rev.user?.toString() === req.user._id.toString()) {
        return { ...rev.toObject(), rating: Number(rating), comment }; // update rating & comment
      }
      return rev;
    });
  } else {
    product.reviews.push(review);
  }

  // Step 5: Update review count
  product.numOfReviews = product.reviews.length;

  // Step 6: Update average rating
  const totalRating = product.reviews.reduce(
    (acc, item) => acc + item.rating,
    0
  );
  product.ratings = totalRating / product.reviews.length;

  // Step 7: Save
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: isReviewed ? "Review updated" : "Review added",
  });
});

// @desc getSingleProductReviews
// @route GET /api/products/reviews
// @access Public
const getSingleProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate({
    path: "reviews.user",
    select: "name avatar",
  });
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }
  res.status(200).json({ success: true, reviews: product.reviews });
});

//@desc Delete Review
// @route DELETE /api/products/review
// @access Admin

const deleteReview = asyncHandler(async (req, res, next) => {
  // 🧾 Step 1: Find the product using the productId from query parameters
  const product = await Product.findById(req.query.productId);

  // ❌ Step 2: If product is not found, return a 404 error
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // 🧹 Step 3: Filter out the review to be deleted using its _id from query parameters
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  // 🔢 Step 4: Count the remaining number of reviews
  const numOfReviews = reviews.length;

  // 📊 Step 5: Recalculate total rating based on remaining reviews
  let totalRating = reviews.reduce((acc, item) => acc + item.rating, 0);

  // 🌟 Step 6: Recalculate average rating (handle zero reviews case)
  product.ratings = numOfReviews === 0 ? 0 : totalRating / numOfReviews;

  // 🧾 Step 7: Update product review count and review list
  product.numOfReviews = numOfReviews;
  product.reviews = reviews;

  // 💾 Step 8: Save the updated product without running validations
  await product.save({ validateBeforeSave: false });

  // ✅ Step 9: Send success response to the client
  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});


const deleteSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // 🔥 Delete all associated images from Cloudinary
  for (const img of product.images) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  // ❌ Delete product from DB
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});


//@desc get Admin All Products
// @route GET /api/admin/products
// @access Admin
const getProductsAdmin = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
  });
});

//Export
module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteSingleProduct,
  createProductReview,
  getSingleProductReviews,
  deleteReview,
  getProductsAdmin,
};
