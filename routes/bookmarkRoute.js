var express = require("express");
var router = express.Router();
const {
  addBookmark,
  removeBookmark,
  getBookmark,
} = require("../services/bookmark.service");

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params; // Use req.params to access route parameters

  const response = await getBookmark(userId);
  res.json(response);
});

router.post("/:restaurantId", async (req, res, next) => {
  const { restaurantId } = req.params; // Use req.params to access route parameters
  const { userId } = req.body;

  const response = await addBookmark(restaurantId, userId);
  res.json(response);
});

router.delete("/:restaurantId", async (req, res, next) => {
  const { restaurantId } = req.params;
  const { userId } = req.body;

  const response = await removeBookmark(restaurantId, userId);
  res.json(response);
});

module.exports = router;
