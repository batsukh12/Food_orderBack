const { mongoConfig, tokenSec } = require("../config");
const MongoDB = require("./mongoDB.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRegistration = async (user) => {
  try {
    if (!user?.username || !user?.password || !user?.email)
      return { status: false, message: "Fill all fields" };
    const passHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username,
      email: user?.email,
      password: passHash,
    };
    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.User)
      .insertOne(userObject);
    if (savedUser?.acknowledged && savedUser?.insertedId) {
      let token = jwt.sign(
        { username: userObject?.username, email: userObject?.email },
        tokenSec,
        { expiresIn: "1h" }
      );
      return {
        status: true,
        message: "User registered successfully.",
        data: token,
      };
    } else {
      return {
        status: false,
        message: "User register failed.",
      };
    }
  } catch (error) {
    error?.code === 11000 ? (errMessage = "user alreadey exist") : null;
    return {
      status: false,
      message: errMessage,
      error: error,
    };
  }
};
const userLogin = async (user) => {
  try {
    if (!user?.email || !user?.password)
      return { status: false, message: "Fill all fields" };
    let userObject = await MongoDB.db
      .collection(mongoConfig.collections.User)
      .findOne({ email: user?.email });
    if (userObject) {
      let passVerified = await bcrypt.compare(
        user?.password,
        userObject?.password
      );
      if (passVerified) {
        let token = jwt.sign(
          { username: userObject?.username, email: userObject?.email },
          tokenSec,
          { expiresIn: "1h" }
        );
        return {
          status: true,
          message: "User login successful",
          data: token,
        };
      } else {
        return {
          status: false,
          message: "incorrect password",
        };
      }
    } else {
      return { status: false, message: "User not found" };
    }
  } catch (error) {
    return {
      status: false,
      message: "User login failed",
      error: error,
    };
  }
};
module.exports = { userRegistration, userLogin };
