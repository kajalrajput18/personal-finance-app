const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    alertLevel: {
      type: String,
      enum: ["SAFE", "WARNING", "CRITICAL", "EXCEEDED"],
      default: "SAFE",
    },
    limit: {
      type: Number,
      required: true,
    },
    month: {
      type: Number, // 1–12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
