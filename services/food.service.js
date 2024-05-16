const { mongoConfig } = require("../config");
const MongoDB = require("./mongoDB.service");

const getFoodById = async (foodId) => {
  try {
    let food = await MongoDB.db
      .collection(mongoConfig.collections.Food)
      .findOne({ id: foodId });

    if (food) {
      return {
        status: true,
        message: "Food found successfully",
        data: food,
      };
    } else {
      return {
        status: false,
        message: "No Food found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Food finding failed",
      error: `Food finding failed : ${error?.message}`,
    };
  }
};
const getFoods = async () => {
  try {
    let foods = await MongoDB.db
      .collection(mongoConfig.collections.Food)
      .find({})
      .toArray();

    if (foods.length > 0) {
      return {
        status: true,
        message: "Foods found successfully",
        data: foods,
      };
    } else {
      return {
        status: false,
        message: "No Foods found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Foods fetching failed",
      error: `Foods fetching failed: ${error?.message}`,
    };
  }
};

module.exports = { getFoodById, getFoods };
