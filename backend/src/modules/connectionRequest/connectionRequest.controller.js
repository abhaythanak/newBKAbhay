const connectionRequestService = require("./connectionRequest.service");
const asyncHandler = require("../../utils/asyncHandler");
const {
  validateSendRequest,
  validateReviewRequest,
} = require("./connectionRequest.schema");

const sendRequest = asyncHandler(async (req, res) => {
  validateSendRequest(req.params);
  const fromUserId = req.user._id;
  const { status, toUserId } = req.params;

  const { request, targetUser } = await connectionRequestService.sendRequest(
    fromUserId,
    toUserId,
    status,
  );

  res.status(200).json({
    message: `${req.user.firstName} is ${status} in ${targetUser.firstName}`,
    data: request,
  });
});

const reviewRequest = asyncHandler(async (req, res) => {
  validateReviewRequest(req.params);
  const loggedInUser = req.user;
  const { status, requestId } = req.params;

  const data = await connectionRequestService.reviewRequest(
    loggedInUser._id,
    requestId,
    status,
  );

  res.status(200).json({
    message: "connection request " + status,
    data,
  });
});

module.exports = {
  sendRequest,
  reviewRequest,
};
