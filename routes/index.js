let express = require("express");
const router = express.Router();
const passport = require("../configs/passport-local");
const Strategy = require("passport-local/lib");
const userController = require("../controllers/user");
router.get("/", (req, res) => {
  return res.render("./v1.ejs");
});
router.get("/sign-in", (req, res) => {
  res.render("signIn.ejs");
});
router.get("/sign-up", (req, res) => {
  res.render("signUp.ejs");
});
router.post(
  "/sign-in",
  passport.authenticate("local", {
    failureRedirect: "/sign-in",
    successRedirect: "/sign-up",
  }),
  (req, res) => {
    res.send(req.body);
  }
);

router.post("/sign-up", userController.createUser);
router.use(
  "/student",
  passport.authorizedStudent,
  require("./student/student")
);
router.use(
  "/ta",
  passport.authorizedTa,
  require("./teachingAssistant/teachingAssistant")
);
router.use(
  "/teacher",
  passport.authorizedTeacher,
  require("./teacher/teacher")
);
module.exports = router;
