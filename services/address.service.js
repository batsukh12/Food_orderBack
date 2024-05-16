const { mongoConfig } = require("../config");
const MongoDB = require("./mongoDB.service");

const addAddress = async (address, userId) => {
  console.log("Address:", address);
  console.log("UserId:", userId);

  try {
    const newAddress = {
      address: address.address,
      longitude: address.longitude,
      latitude: address.latitude,
      name: address.name,
      userId: userId,
    };

    const mark = await MongoDB.db
      .collection(mongoConfig.collections.ADDRESS)
      .insertOne(newAddress);

    if (mark.insertedId) {
      return {
        status: true,
        message: "Address added successfully",
        data: mark.insertedId,
      };
    } else {
      return {
        status: false,
        message: "Address add failed",
      };
    }
  } catch (error) {
    console.log("MongoDB Error:", error.message);
    return {
      status: false,
      message: "Address add failed",
      error: `Address add failed: ${error.message}`,
    };
  }
};

const getAddress = async (userId) => {
  try {
    const marks = await MongoDB.db
      .collection(mongoConfig.collections.ADDRESS)
      .find({ userId })
      .toArray();

    if (marks.length > 0) {
      return {
        status: true,
        message: "Address fetched successfully",
        data: marks,
      };
    } else {
      return {
        status: false,
        message: "No Address found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Address fetch failed",
      error: `Address fetch failed: ${error.message}`,
    };
  }
};

module.exports = { addAddress, getAddress };
