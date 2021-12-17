const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    hash: String,
    salt: String,
  },
  role: {
    student: { type: Boolean, default: false },
    ta: { type: Boolean, default: false },
    teacher: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
  ta: {
    doubtsAccepted: [
      {
        doubt: { type: mongoose.SchemaTypes.ObjectId, ref: "Doubt" },
        doubtAcceptalTime: { type: Date },
      },
    ],
    doubtsResolved: [
      {
        doubt: { type: mongoose.SchemaTypes.ObjectId, ref: "Doubt" },
        avgActivityTime: { type: Number },
      },
    ],
    doubtsEscalated: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Doubt" }],
  },
});
const Users = mongoose.model("User", userSchema);
module.exports = Users;
