const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["hold", "release", "refund"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);