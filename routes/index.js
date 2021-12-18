let express = require("express");
const router = express.Router();
const passport = require("../configs/passport-local");
const Strategy = require("passport-local/lib");
const userController = require("../controllers/user");
router.get("/", userController.redirectUserToSpecificHomePage);
//  User sign in and and sign up
router.get("/sign-in", (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.render("signIn.ejs");
});
router.get("/sign-up", (req, res) => {
  // if user is already logged in
  if (req.isAuthenticated()) return res.redirect("/");
  res.render("signUp.ejs");
});
router.get("/log-out", userController.logout);

router.post(
  "/sign-in",
  passport.authenticate("local", {
    failureRedirect: "/sign-in",
  }),
  userController.createSession
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
