var express = require("express");
var router = express.Router();
const { getFoodById, getFoods } = require("../services/food.service");

router.get("/:foodId", async (req, res, next) => {
  const foodId = req?.params?.foodId;
  const response = await getFoodById(foodId);
  res.json(response);
});
router.get("/", async (req, res, next) => {
  const response = await getFoods();
  res.json(response);
});
module.exports = router;
