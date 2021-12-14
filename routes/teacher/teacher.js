let express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  return res.send("teacher homepage");
});
module.exports = router;
