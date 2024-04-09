var express = require("express");
var router = express.Router();
const {
  addToCart,
  removeFromCart,
  getCartItems,
} = require("../services/cart.service");

router.post("/:foodId", async (req, res, next) => {
  const { foodId } = req?.params;
  const userId = req?.body;
  // Call addToCart function with foodId and userId
  const response = await addToCart(foodId, userId);
  res.json(response);
});

router.get("/", async (req, res, next) => {
  const { userId } = req?.body;

  const response = await getCartItems(userId);
  res.json(response);
});

router.delete("/:foodID", async (req, res, next) => {
  const { userId } = req.body;

  // Call addToCart function with foodId and userId
  const response = await removeFromCart(userId);
  res.json(response);
});

module.exports = router;
