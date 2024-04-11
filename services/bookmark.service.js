const { mongoConfig } = require("../config");
const MongoDB = require("./mongoDB.service");

const addBookmark = async (restaurantId, userId) => {
  try {
    let mark = await MongoDB.db
      .collection(mongoConfig.collections.Bookmark)
      .insertOne({ restaurantId, userId });

    if (mark.insertedId) {
      let response = await getBookmark(userId);
      return {
        status: true,
        message: "Bookmark added successfully",
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: "Bookmark add failed",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Bookmark add failed",
      error: `Bookmark add failed: ${error?.message}`,
    };
  }
};

const removeBookmark = async (restaurantId, userId) => {
  try {
    let mark = await MongoDB.db
      .collection(mongoConfig.collections.Bookmark)
      .deleteOne({ restaurantId, userId });

    if (mark?.deletedCount > 0) {
      let response = await getBookmark(userId);

      return {
        status: true,
        message: "Bookmark removed successfully",
        data: response?.data,
      };
    } else {
      return {
        status: false,
        message: "Bookmark remove failed",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Bookmark remove failed",
      error: `Bookmark remove failed: ${error?.message}`,
    };
  }
};

const getBookmark = async (userId) => {
  try {
    let marks = await MongoDB.db
      .collection(mongoConfig.collections.Bookmark)
      .aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: "restaurants",
            localField: "restaurantId",
            foreignField: "id",
            as: "restaurant",
          },
        },
      ])
      .toArray();

    if (marks?.length > 0) {
      return {
        status: true,
        message: "Bookmarks fetched successfully",
        data: marks,
      };
    } else {
      return {
        status: false,
        message: "No bookmarks found",
      };
    }
  } catch (error) {
    return {
      status: false,
      message: "Bookmark fetch failed",
      error: `Bookmark fetch failed: ${error?.message}`,
    };
  }
};

module.exports = { addBookmark, removeBookmark, getBookmark };
