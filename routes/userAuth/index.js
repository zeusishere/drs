let express = require("express");
const router = express.Router();
const passport = require("passport");
router.get("/sign-in", (req, res) => {
  return res.render("./v1.ejs");
});

module.exports = router;
