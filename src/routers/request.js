const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const router = express.Router();


router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        // check user is present in data base or not.
        const checkUser = await User.findById(toUserId)
        // check only allowed status from enum to compare with db
        const allowedStatus = ["ignore", "interested"]

        // if (fromUserId === toUserId) {
        //     return res.status(400).send({ message: "cannot send request to self!!!." })
        // }

        if (!checkUser) {
            return res.status(400).send({ message: "User not found!!!" })
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "invalid status type" + status })
        }

        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                {
                    fromUserId,
                    toUserId,
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId
                }
            ],
        })

        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection request Already Exist!!!." })
        }

        const ConnectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        });
        // console.log(ConnectionRequest)
        const data = await ConnectionRequest.save()

        res.json({
            message: req.user.firstName + "is" + status + "in" + checkUser.firstName,
            data,
        })
    } catch (error) {
        res.status(400).json({ message: "Error sending request", error: error.message });
    }
})

router.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        // comes from userAuth next() loggedInUser data
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: `${status} not allowed` })
        }
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        })
        console.log(_id)
        if (!connectionRequest) {
            return res.status(404).json({ message: "connection request not found" })
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save()
        res.send({ message: "connection request" + status, data })

    } catch (error) {
        res.status(400).json({ message: "Error sending request", error: error.message });
    }
})

module.exports = router;