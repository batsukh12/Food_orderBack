var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var authRouter = require("./routes/auth");
var userRouter = require("./routes/userRoute");
var restaurantRouter = require("./routes/restaurantRoute");
var cartRouter = require("./routes/cartRoute");
var foodRouter = require("./routes/foodRoute");
const MongoDB = require("./services/mongoDB.service");

MongoDB.connectionMongoDB();
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("static"));
//app.use("*", require("./services/auth.service").tokenVerification);

app.use("/api", authRouter);
app.use("/api/user", userRouter);
app.use("/api", restaurantRouter);
app.use("/api/cart", cartRouter);
app.use("/api/food", foodRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
