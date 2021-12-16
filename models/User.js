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
});
const Users = mongoose.model("User", userSchema);
module.exports = Users;
