// models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  rate_per_kg: {
    type: Number,
    required: true,
    default: 50
  },
  description: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model("Category", categorySchema);
