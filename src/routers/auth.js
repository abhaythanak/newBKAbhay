const express = require("express");
const router = express.Router();
//. or we can route it like. const authRouter = express.Router() for understanding
const User = require("../models/user")
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");


//.  post
router.post("/signup", async (req, res) => {
    // console.log(req.body);
    const { emailId, password, ...rest } = req.body;
    try {
        // validate of data
        validateSignupData(req);
        // encrypt Password

        const passwordHash = await bcrypt.hash(password, 10)
        //console.log(passwordHash)

        const existingUser = await User.findOne({ emailId });
        // if (existingUser) {
        //   return res.status(400).send("Email Id already present.")
        // }
        const user = new User({ emailId, password: passwordHash, ...rest })
        await user.save()
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error saving user", error: error.message });
    }

})
// post login
router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Crediential")
        }
        //  encrypt password check
        const isPasswordValid = await user.validatePassword(password)
        if (isPasswordValid) {
            // create jwt token
            // const token = await jwt.sign({ _id: user._id }, "Abhay@123",{expiresIn:"7d"})
            const token = await user.getJWT();
            console.log(token)
            // Add the token to cookie and send to user 
            // res.cookie("token", "shjdbfhksi7fgiw3u4hgrfkfhu4eft@$t24guotl$T$tgfuuwuyf")
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            })
        }
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
            },
        });

    } catch (error) {
        res.status(400).json({ message: "Error saving user", error: error.message });
    }
})

module.exports = router