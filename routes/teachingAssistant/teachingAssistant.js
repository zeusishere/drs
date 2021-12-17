let express = require("express");
let taController = require("../../controllers/ta/ta");
const router = express.Router();
router.get("/", taController.renderTaHome);
router.get("/open-doubt/", taController.renderDoubt);
router.get("/accept-doubt", taController.renderTaHome);
router.post("/answer-doubt", taController.answerDoubt);
router.get("/escalate-doubt", taController.escalateDoubt);

module.exports = router;
