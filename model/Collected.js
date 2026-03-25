const mongoose = require("mongoose");

const collectedSchema = new mongoose.Schema({

  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },

  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  product_description: {
    type: String,
    required: true
  },

  actual_weight: {
    type: Number,
    required: true,
    min: 0
  },

  received_time: {
    type: Date,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Collected", collectedSchema);