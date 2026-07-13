const express = require("express");
const router = express.Router();
const feedController = require("./feed.controller");
const { userAuth } = require("../../middlewares/auth.middleware");

router.get("/feed",userAuth, feedController.getFeed);

module.exports = router;
