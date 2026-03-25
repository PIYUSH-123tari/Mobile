const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({

  pickupRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PickupRequest",
    required: true
  },

  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true
  },

  assigned_date: {
    type: Date,
    required: true
  },

  assigned_time: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);