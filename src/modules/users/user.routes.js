const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { userAuth } = require("../../middlewares/auth.middleware");

router.get("/user/request/received", userAuth, userController.getReceivedRequests);
router.get("/user/connections", userAuth, userController.getConnections);

router.patch("/user", userController.updateUser);
router.get("/user", userController.getUser);
router.delete("/user", userController.deleteUser);

module.exports = router;
