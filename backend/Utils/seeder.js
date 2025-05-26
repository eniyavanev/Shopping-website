const products = require("../src/data/products.json");
const Product = require("../src/models/productModel.js");
const connectDB = require("../src/connectMongoDB/connectDB.js");
const dotenv = require("dotenv");
dotenv.config();

connectDB();
const seedProducts = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};
seedProducts();
