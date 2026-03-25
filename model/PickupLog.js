// model/PickupLog.js
// Place in BOTH Ecoloop/model/ and ADMIN/models/

const mongoose = require("mongoose");

const pickupLogSchema = new mongoose.Schema({

  // Using String instead of ObjectId because admin_Id is a custom string like "admin-north-goa"
  admin: {
    type: String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PickupRequest",
    default: null
  },

  type: {
    type: String,
    enum: ["update", "delete"],
    required: true
  },

  message: {
    type: String,
    required: true
  },

  snapshot: {
    category:    { type: String, default: null },
    description: { type: String, default: null },
    weight:      { type: Number, default: null },
    address:     { type: String, default: null },
    date:        { type: Date,   default: null },
  },

  read: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("PickupLog", pickupLogSchema);