const { mongoConfig } = require("../config");
const MongoDB = require("./mongoDB.service");
const { ObjectId } = require("mongodb"); // Import ObjectId from the MongoDB driver

const addToCart = async (items, userId) => {
  try {
    const newCartItem = {
      food: items,
      userId: userId,
      date: new Date().toISOString(),
    };

    await MongoDB.db
      .collection(mongoConfig.collections.Cart)
      .insertOne(newCartItem);

    return {
      status: true,
      message: "Item added to cart successfully.",
    };
  } catch (err) {
    return {
      status: false,
      message: "Failed to add/update cart item.",
      error: err.message,
    };
  }
};
const removeFromCart = async (foodId, userId) => {
  try {
    let cart = await MongoDB.db
      .collection(mongoConfig.collections.Cart)
      .findOne({ foodId, username, count: 1 });
    if (cart) {
      await MongoDB.db
        .collection(mongoConfig.collections.CARTS)
        .deleteOne({ foodId, username });
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Removed from Cart Successfully",
        data: cartResponse?.data,
      };
    }
    let updatedCart = await MongoDB.db
      .collection(mongoConfig.collections.Cart)
      .updateOne(
        { foodId, username },
        { $inc: { count: -1 } },
        { upsert: true }
      );
    if (updatedCart?.modifiedCount > 0 || updatedCart?.upsertedCount > 0) {
      let cartResponse = await getCartItems({ username });
      return {
        status: true,
        message: "Item Removed from Cart Successfully",
        data: cartResponse?.data,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Item Removed from Cart Failed",
    };
  }
};
const getCartItems = async (userId) => {
  try {
    const cartItems = await MongoDB.db
      .collection(mongoConfig.collections.Cart)
      .aggregate([
        {
          $match: { userId: userId },
        },
        {
          $unwind: {
            path: "$food",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "Foods",
            localField: "food.foodId",
            foreignField: "id",
            as: "foodDetails",
          },
        },
        {
          $addFields: {
            foodDetails: { $arrayElemAt: ["$foodDetails", 0] },
          },
        },
        {
          $project: {
            food: 1,
            userId: 1,
            date: 1,
          },
        },
      ])
      .toArray();

    if (cartItems.length > 0) {
      return {
        status: true,
        message: "Cart fetched successfully",
        data: cartItems,
      };
    } else {
      return {
        status: false,
        message: "No cart found for this user",
        data: cartItems, // Return data even if empty for consistency
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Failed to fetch cart items",
      error: error.message, // Include the error message for debugging
    };
  }
};

module.exports = { addToCart, removeFromCart, getCartItems };
