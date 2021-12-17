let express = require("express");
const router = express.Router();
const teacherController = require("../../controllers/teacher/teacher");
// router.get("/", (req, res) => {
//   return res.send("teacher homepage");
// });
router.get("/", teacherController.renderDashboard);
module.exports = router;
