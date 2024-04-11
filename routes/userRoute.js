var express = require("express");
var router = express.Router();
const { getUserData } = require("../services/user.service");

router.get("/:getUser", async (req, res) => {
  let email = req.params.getUser; // Corrected to extract email from req.params.getUser
  let response = await getUserData(email); // Corrected to pass email instead of req.params
  res.json(response);
});

module.exports = router;
