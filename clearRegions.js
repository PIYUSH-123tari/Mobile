const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Region = require("./model/Region");

const clearRegions = async () => {
  try {
    await connectDB();
    console.log("Connected. Clearing regions...");
    
    // Clear existing if any
    await Region.deleteMany({});
    
    console.log("Successfully cleared all regions.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error clearing regions:", error);
    process.exit(1);
  }
};

clearRegions();
