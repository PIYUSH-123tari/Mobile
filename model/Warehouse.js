// models/Warehouse.js
const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  address: String,
  total_capacity: Number,
  region_id: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "Manager" }
});

module.exports = mongoose.model("Warehouse", warehouseSchema);
