const { mongoConfig } = require("../config");
const MongoDB = require("./mongoDB.service");
const { ObjectId } = require("mongodb"); // Import ObjectId from the MongoDB driver

const getUserData = async (userId) => {
  try {
    const objectIdUserId = new ObjectId(userId);

    let userObj = await MongoDB.db
      .collection(mongoConfig.collections.User)
      .findOne({ _id: objectIdUserId }, { password: 0 });
    if (userObj) {
      return {
        status: true,
        message: "user found succesfully",
        data: userObj,
      };
    } else {
      return { status: false, message: "User not found" };
    }
  } catch (err) {
    return { status: false, message: "User find failed", error: err.message };
  }
};
module.exports = { getUserData };
