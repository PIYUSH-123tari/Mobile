const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Region = require("./model/Region");

const checkData = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB Atlas.");

    const rawRegions = await mongoose.connection.db.collection("regions").find({}).toArray();
    console.log("Raw documents in 'regions' collection:");
    console.log(JSON.stringify(rawRegions, null, 2));

    const modelRegions = await Region.find({});
    console.log("\nDocuments returned by Mongoose Region.find():");
    console.log(JSON.stringify(modelRegions, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkData();
