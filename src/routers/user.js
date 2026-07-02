const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const router = express.Router();



router.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
            // .populate("fromUserId",["firstName","lastName","age","gender","photoUrl","about","skills"]). ||||. or
            .populate("fromUserId", "firstName lastName age gender photoUrl about skills")

        res.json({
            message: "Data fetch successfully",
            data: connectionRequest
        })

    } catch (error) {
        res.status(400).send("failed to update:" + error.message)
    }
})

router.get("/user/connections", userAuth, async (req, res) => {
    try {
        const SAFE_DATA = ["fromUserId", "firstName lastName age gender photoUrl about skills"]
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", SAFE_DATA).populate("toUserId", SAFE_DATA)
        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({ data })
    } catch (error) {
        res.status(400).send("failed to update:" + error.message)
    }
})



//.     ------- --- ------------- ---------------- ---------------
//.     ------- --- ------------- ---------------- ---------------
//.     ------- --- ------------- ---------------- ---------------
//.  user data All thats not needed 
//.  patch
router.patch("/user", async (req, res) => {
    const data = req.body;
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after", runValidators: true })
        res.status(201).send("user updated successfully")
    } catch (error) {
        res.status(400).send("failed to update:" + error.message)
    }
})

//.  get
router.get("/user", async (req, res) => {
    const useremail = req.body.emailId
    try {
        const user = await User.findOne({ emailId: useremail })
        if (user.length === 0) {
            res.status(404).send("user not found")
        } else {
            res.status(200).send(user)
        }

    } catch (error) {
        res.status(404).send("error saving the user:" + err.message)
    }
})
//.  delete
router.delete("/user", async (req, res) => {
    const userId = req.body.userId
    try {
        const deleteUser = await User.findOneAndDelete(userId)
        // const deleteUser = await User.findByIdAndDelete({ _id: userId })
        res.status(201).send("UserDeleted Successfully")
    } catch (error) {
        res.status(400).send("Deletion Failed:", error)
    }
})

module.exports = router;