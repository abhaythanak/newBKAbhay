const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();


router.post("/sendConnectionRequest",userAuth,async (requestAnimationFrame,res)=>{
    const user = req.user;
    console.log("connection request sent")
    res.send(user.firstName + "sent the connection request")
})

module.exports = router;