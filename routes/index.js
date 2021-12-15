let express = require("express");
const router = express.Router();
const passport = require("passport");
router.get("/", (req, res) => {
  return res.render("./v1.ejs");
});
router.use("/student", require("./student/student"));
router.use("/ta", require("./teachingAssistant/teachingAssistant"));
router.use("/teacher", require("./teacher/teacher"));
module.exports = router;
