var express = require("express");
var router = express.Router();
const { userRegistration, userLogin } = require("../services/auth.service");
/* GET users listing. */
router.post("/register", async (req, res, next) => {
  let body = req.body;
  let response = await userRegistration(body);
  res.json(response);
});
router.post("/login", async (req, res, next) => {
  let body = req.body;
  let response = await userLogin(body);
  res.json(response);
});

module.exports = router;
