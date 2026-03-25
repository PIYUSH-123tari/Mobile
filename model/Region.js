const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  region_name: {
    type: String,
    required: true,
    unique: true
  },
  state: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Region", regionSchema);
