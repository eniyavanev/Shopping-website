const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = () => {
 const db = mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"));
   
    
};

module.exports = connectDB;
