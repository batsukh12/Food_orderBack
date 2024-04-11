const { mongoConfig } = require("../config");
const MongoDB = require("./mongoDB.service");

const getUserData = async (email) => {
  try {
    let userObj = await MongoDB.db
      .collection(mongoConfig.collections.User)
      .findOne({ email: email }, { password: 0 }); // Excluding the password field from the returned user object
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
