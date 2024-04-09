var express = require("express");
var router = express.Router();
const {
  getAllRestaurant,
  getRestaurantById,
} = require("../services/restaurant.service");

router.get("/restaurant", async (req, res) => {
  let response = await getAllRestaurant();
  res.json(response);
});
router.get("/restaurant/:restaurantId", async (req, res) => {
  let id = req?.params.restaurantId;
  let response = await getRestaurantById(id);
  res.json(response);
});
module.exports = router;
