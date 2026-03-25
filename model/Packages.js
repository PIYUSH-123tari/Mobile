// models/Package.js
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  pickup_id: { type: mongoose.Schema.Types.ObjectId, ref: "PickupRequest" },
  agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  warehouse_id: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

  actual_weight: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Package", packageSchema);
