const { mongoConfig } = require("../config");
const MongoDB = require("./mongoDB.service");

const getAllRestaurant = async () => {
  try {
    let restaurants = await MongoDB.db
      .collection(mongoConfig.collections.Restuarant)
      .find()
      .toArray();

    if (restaurants.length > 0) {
      return {
        status: true,
        message: "Restaurants found successfully",
        data: restaurants,
      };
    } else {
      return {
        status: false,
        message: "No restaurants found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Restaurant finding failed",
      error: `Restaurant finding failed : ${error?.message}`,
    };
  }
};

const getRestaurantById = async (restaurantId) => {
  try {
    let restaurant = await MongoDB.db
      .collection(mongoConfig.collections.Restuarant)
      .aggregate([
        {
          $match: {
            id: restaurantId,
          },
        },
        {
          $lookup: {
            from: "Foods",
            localField: "id",
            foreignField: "restaurantId",
            as: "foods",
          },
        },
      ])
      .toArray();
    if (restaurant && restaurant?.length > 0) {
      return {
        status: true,
        message: "Restaurant found successfully",
        data: restaurant[0],
      };
    } else {
      return {
        status: false,
        message: "No restaurant found with the provided ID",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Restaurant finding failed",
      error: `Restaurant finding failed : ${error?.message}`,
    };
  }
};

module.exports = { getAllRestaurant, getRestaurantById };
