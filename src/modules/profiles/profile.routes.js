const express = require("express");
const router = express.Router();
const profileController = require("./profile.controller");
const { userAuth } = require("../../middlewares/auth.middleware");

router.get("/profile/view", userAuth, profileController.viewProfile);
router.patch("/profile/edit", userAuth, profileController.editProfile);

module.exports = router;
