const mongoose = require("mongoose");
const doubtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    answer: { type: String, default: "" },
    answeredBy: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["resolved", "active", "pending"],
      default: "pending",
    },
    timeOfResolution: { type: Date },
    comments: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);
const Doubts = mongoose.model("Doubt", doubtSchema);
module.exports = Doubts;
