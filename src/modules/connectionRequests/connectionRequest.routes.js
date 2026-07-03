const express = require("express");
const router = express.Router();
const connectionRequestController = require("./connectionRequest.controller");
const { userAuth } = require("../../middlewares/auth.middleware");

router.post(
    "/request/send/:status/:toUserId",
    userAuth,
    connectionRequestController.sendRequest
);

router.post(
    "/request/review/:status/:requestId",
    userAuth,
    connectionRequestController.reviewRequest
);

module.exports = router;
