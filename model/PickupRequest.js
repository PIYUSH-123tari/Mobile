const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const pickupRequestSchema = new mongoose.Schema({

  pickupRequest_id: {
    type: String,
    unique: true,
    required: true,
    default: () => uuidv4()
  },

  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // Copied from user
  region_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  userPhone: {
    type: String,
    required: true
  },

  additional_phone_no: {
    type: String,
    default: null
  },

  // 🔥 Category reference
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  // 🔥 User's own description
  waste_description: {
    type: String,
    required: true
  },

  estimated_weight: {
    type: Number,
    required: true
  },

  pickup_address: {
    type: String,
    required: true
  },

  preferred_date: {
    type: Date,
    required: true
  },

  image: {
    type: String,
    default: null
  },

  status: {
    type: String,
    enum: ["pending", "assigned", "collected"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("PickupRequest", pickupRequestSchema);