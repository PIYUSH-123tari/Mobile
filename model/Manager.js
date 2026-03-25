// models/Manager.js
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const managerSchema = new mongoose.Schema({
  admin_Id: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  // 🔗 Reference to Region collection
  region_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Region",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Manager", managerSchema);



