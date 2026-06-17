const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();

//. profile. 
router.get("/profile",userAuth, async (req, res) => {
  try {
    const user = req.user
    // const cookies = req.cookies
    // const { token } = cookies
    // const isTokenValid = await jwt.verify(token, "Abhay@123")
    // if (!isTokenValid) {
    //   throw new Error("token expired")
    // }
    // const { _id } = isTokenValid
    // const user = await User.findById(_id)
    res.send(user)
  } catch (error) {
    res.status(400).json({ message: "Error saving user", error: error.message });
  }

})

module.exports = router