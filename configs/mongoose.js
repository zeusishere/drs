// to setup and export connection to mongoDB
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://shubham:2424554@cluster0.w9vzk.mongodb.net/node_auth?retryWrites=true&w=majority"
);
let db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "connection error :cannot connect to the db")
); // on vs once
db.once("open", () => {
  console.log("connected successfully to the Database");
});
module.exports = db;
