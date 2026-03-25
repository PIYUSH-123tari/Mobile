const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://ecoloop_user:ecoloop_pass@cluster0.rtm00qj.mongodb.net/ecoloop?appName=Cluster0"; // Fallback for local testing if not set
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected to ecoloop DB");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
