module.exports = {
  mongoConfig: {
    connectionURL: "mongodb://127.0.0.1:27017",
    database: "Food_order",
    collections: {
      User: "User",
    },
  },
  serverConfig: {
    ip: "172.20.10.4",
    port: 3001,
  },
  tokenSec: "very_secret",
};
