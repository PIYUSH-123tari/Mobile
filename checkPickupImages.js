const mongoose = require("mongoose");
const connectDB = require("./config/db");
const PickupRequest = require("./model/PickupRequest");
const fs = require("fs");
require("dotenv").config();

const checkImages = async () => {
  await connectDB();
  const pickups = await PickupRequest.find().sort({ createdAt: -1 }).limit(10);
  const images = pickups.map(p => ({ id: p._id, image: p.image }));
  fs.writeFileSync("output.json", JSON.stringify(images, null, 2));
  mongoose.connection.close();
};

checkImages();
