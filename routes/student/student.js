let express = require("express");
const router = express.Router();
const studentController = require("../../controllers/student/student");
router.get("/", studentController.renderStudentHome);
router.get("/raise-doubt", studentController.renderCreateDoubtPage);
router.post("/raise-doubt", studentController.createDoubt);
router.post("/add-comment", studentController.createACommentAndAddItToDoubt);
module.exports = router;
