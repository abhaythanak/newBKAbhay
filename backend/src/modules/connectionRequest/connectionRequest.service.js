const ConnectionRequest = require("./connectionRequest.model");
const User = require("../user/user.model");
const ApiError = require("../../utils/ApiError");

const sendRequest = async (fromUserId, toUserId, status) => {
  // Check if target user exists
  const checkUser = await User.findById(toUserId);
  if (!checkUser) {
    throw new ApiError(404, "User not found!!!");
  }

  // Check if request already exists
  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (existingRequest) {
    throw new ApiError(400, "Connection request Already Exist!!!.");
  }

  const newRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status,
  });

  const savedRequest = await newRequest.save();
  return {
    request: savedRequest,
    targetUser: checkUser,
  };
};

const reviewRequest = async (loggedInUserId, requestId, status) => {
  const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUserId,
    status: "interested",
  });

  if (!connectionRequest) {
    throw new ApiError(404, "connection request not found");
  }

  connectionRequest.status = status;
  return await connectionRequest.save();
};

module.exports = {
  sendRequest,
  reviewRequest,
};
