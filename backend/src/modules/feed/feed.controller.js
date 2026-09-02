const feedService = require("./feed.service");
const asyncHandler = require("../../utils/asyncHandler");

const getFeed = asyncHandler(async (req, res) => {
  const users = await feedService.getFeed();
  res.status(200).send(users);
});

module.exports = {
  getFeed,
};
