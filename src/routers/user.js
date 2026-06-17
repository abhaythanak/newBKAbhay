const express = require("express");
const User = require("../models/user");
const router = express.Router();


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