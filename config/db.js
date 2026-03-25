const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ecoloop_user:ecoloop_pass@cluster0.rtm00qj.mongodb.net/ecoloop?appName=Cluster0");
    console.log("MongoDB Connected to ecoloop DB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
