let express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  return res.send("ta homepage");
});
module.exports = router;
