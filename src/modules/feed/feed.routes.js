const express = require("express");
const router = express.Router();
const feedController = require("./feed.controller");
const { userAuth } = require("../../middlewares/auth.middleware");
const ConnectionRequestModel = require("../connectionRequest/connectionRequest.model");

router.get("/feed", userAuth, async (req, res) => {
    try {
        // user should see all the user cards except
        //0 his own card
        //1 his own card
        //2 ignored people
        //3 already sent the connection request
        // accepted show profile || rejected cannot shown for connection request

        // logged in user 
        const SAFE_DATA = "firstName lastName age gender photoUrl about skills";
        const loggedInUser = req.user

        // find All (see) connection request sent or received
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId toUserId")
        //.populate("firstName", "lastName", "photoUrl", "about", "age", "gender", "emaiId", "skills")

        // hide user from feed 
        const hideUserFromFeed = new set()
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })
        console.log(hideUserFromFeed)
        const users = await UserActivation.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ]
        }).select(SAFE_DATA)

        res.send(users)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

module.exports = router;
