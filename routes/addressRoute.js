var express = require("express");
var router = express.Router();
const { getAddress, addAddress } = require("../services/address.service");

router.get("/", async (req, res, next) => {
  const { userId } = req.query;

  const response = await getAddress(userId);
  res.json(response);
});

router.post("/", async (req, res, next) => {
  const { address, userId } = req.body;
  const response = await addAddress(address, userId);
  res.json(response);
});

module.exports = router;
