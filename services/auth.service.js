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
      const userId = userObject._id;
      if (passVerified) {
        let token = jwt.sign({ userId }, tokenSec, { expiresIn: "0.5h" });
        return {
          status: true,
          message: "User login successful",
          data: token,
          userId: userObject._id,
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
const tokenVerification = async (req, res, next) => {
  console.log(
    `authentication.service | tokenVerification | ${req?.originalUrl}`
  );
  try {
    if (
      req?.originalUrl.includes("/login") ||
      req?.originalUrl.includes("/getUser") ||
      req?.originalUrl.includes("/register")
    )
      return next();
    let token = req?.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token?.length);
      jwt.verify(token, tokenSec, (error, decoded) => {
        if (error) {
          res.status(401).json({
            status: false,
            message: error?.name ? error?.name : "Invalid Token",
            error: `Invalid token | ${error?.message}`,
          });
        } else {
          req["email"] = decoded?.email;
          next();
        }
      });
    } else {
      res.status(401).json({
        status: false,
        message: "Token is missing",
        error: "Token is missing",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: false,
      message: error?.message ? error?.message : "Authentication failed",
      error: `Authentication failed | ${error?.message}`,
    });
  }
};
module.exports = { userRegistration, userLogin, tokenVerification };
