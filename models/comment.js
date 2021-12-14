const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  commentText: { type: String },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
});
