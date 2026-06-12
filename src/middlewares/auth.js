const jwt = require("jsonwebtoken")
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        // read the token fro the req cookies
        const { token } = req.cookies
        if (!token) {
            throw new Error("token is not valid!!....")
        }
        const decodedObj = await jwt.verify(token, "Abhay@123")
        const { _id } = decodedObj;
        const user = await User.findById(_id)
        // validate token
        // find the user
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user
        next()
    } catch (error) {
        res.status(400).send("Error:" + error.message)
    }
}

module.exports = {
    userAuth,
}