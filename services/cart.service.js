const { mongoConfig } = require("../config");
const MongoDB = require("./mongoDB.service");

const addToCart = async (foodId, userId) => {
  try {
    let addCart = await MongoDB.db
      .collection(mongoConfig.collections.Cart)
      .updateOne({ foodId, userId }, { $inc: { count: 1 } }, { upsert: true });
    if (addCart?.modifiedCount > 0 || addCart?.upsertedCount > 0) {
      return {
        status: true,
        message: "Add to cart successfully",
      };
    }
  } catch (err) {
    return {
      status: false,
      message: "Cart add failed",
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
    let cartItems = await MongoDB.db
      .collection(mongoConfig.collections.Cart)
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: "Foods",
            localField: "foodId",
            foreignField: "id",
            as: "food",
          },
        },
        {
          $unwind: {
            path: "$food",
          },
        },
      ])
      .toArray();
    if (cartItems?.length > 0) {
      let itemsTotal = cartItems
        ?.map((cartItem) => cartItem?.food?.price * cartItem?.count)
        ?.reduce((a, b) => parseFloat(a) + parseFloat(b));
      let discount = 0;
      return {
        status: true,
        message: "Cart items fetched Successfully",
        data: {
          cartItems,
          metaData: {
            itemsTotal,
            discount,
            grandTotal: itemsTotal - discount,
          },
        },
      };
    } else {
      return {
        status: false,
        message: "Cart items not found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Cart items fetched Failed",
    };
  }
};

module.exports = { addToCart, removeFromCart, getCartItems };
