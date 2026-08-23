const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skillListingId: { type: mongoose.Schema.Types.ObjectId, ref: "SkillListing", required: true },
    status: {
      type: String,
      enum: ["offered", "requested", "confirmed", "completed", "cancelled", "no_show", "declined"],
      default: "requested",
    },
    creditsAgreed: { type: Number, required: true, min: 1 },
    scheduledAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);