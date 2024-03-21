const { MongoClient } = require("mongodb");
const { mongoConfig } = require("../config");

class MongoDB {
  static connectionMongoDB = () => {
    MongoClient.connect(mongoConfig.connectionURL)
      .then((connection) => {
        console.log("connected succesfully");
        this.db = connection.db(mongoConfig.database);
      })
      .catch((err) => {
        console.log("MongoDb not connect - ${err.message}");
      });
  };
}
MongoDB.db = null;
module.exports = MongoDB;
