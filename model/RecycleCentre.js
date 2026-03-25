// models/RecycleCentre.js
const mongoose = require("mongoose");

const recycleCentreSchema = new mongoose.Schema({
  company_name: String,
  location: String,
  contact_no: String,
  payment_mode: String,
  packages_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Package" }]
});

module.exports = mongoose.model("RecycleCentre", recycleCentreSchema);
