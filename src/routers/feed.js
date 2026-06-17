const express = require("express");
const User = require("../models/user");
const router = express.Router();

// feed API get all users data
router.get("/feed", async (req, res) => {
  try {
    const user = await User.find({})
    res.status(200).send(user)
  } catch (error) {
    res.status(404).send("error saving the user:" + err.message)
  }
})

module.exports = router