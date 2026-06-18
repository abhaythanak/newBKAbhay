const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const router = express.Router();

//. profile. 
router.get("/profile/view", userAuth, async (req, res) => {
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

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit request")
    }

    const loggedInUser = req.user;
    console.log(loggedInUser)
    // edit functionality
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
    await loggedInUser.save();
    //res.send(`${loggedInUser.firstName}, your profile updated successfully!!`)
    res.json({
      message:`${loggedInUser.firstName}, your profile updated successfully!!`,
      data:loggedInUser,
    })
  } catch (error) {
    res.status(400).json({ message: "Error saving user", error: error.message });
  }
})

module.exports = router