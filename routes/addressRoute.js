var express = require("express");
var router = express.Router();
const {
  getAddress,
  addAddress,
  deleteAddress,
} = require("../services/address.service");

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
router.delete("/:addressId", async (req, res, next) => {
  const { addressId } = req.params;
  const response = await deleteAddress(addressId);
  res.json(response);
});
module.exports = router;
