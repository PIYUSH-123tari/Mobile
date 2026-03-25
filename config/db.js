const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ecoloop_user:<P4c29JFXQK8pPQ97>@cluster0.rtm00qj.mongodb.net/?appName=Cluster0");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
