const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  commentText: { type: String },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  doubt: { type: mongoose.SchemaTypes.ObjectId, ref: "Doubt" },
});
const Comments = mongoose.model("Comment", commentSchema);
module.exports = Comments;
