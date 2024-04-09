var express = require("express");
var router = express.Router();
const { getUserData } = require("../services/user.service");
router.get("/getUser", async (req, res) => {
  let email = req?.email;
  let response = await getUserData(email);
  res.json(response);
});
module.exports = router;
