module.exports = {
  mongoConfig: {
    connectionURL: "mongodb://127.0.0.1:27017",
    database: "Food_order",
    collections: {
      User: "User",
      Restuarant: "restaurants",
      Cart: "carts",
      Food: "Foods",
      Bookmark: "Bookmarks",
    },
  },
  serverConfig: {
    // 172.20.10.4
    ip: "192.168.1.211",
    port: 3001,
  },
  tokenSec: "very_secret",
};
