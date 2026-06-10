const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const { validateSignupData } = require("./utils/validation")
const bcrypt = require("bcrypt")
const PORT = 5555;

app.use(express.json())

//.  post
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body
    const user = await User.findOne({ emailId: emailId })
    if (!user) {
      throw new Error("Invalid Crediential")
    }
    //  encrypt password check
    const isPasswordValid = await bcrypt.compare(password, user.password)
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

//.  get
app.get("/user", async (req, res) => {
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
// feed API get all users data
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({})
    res.status(200).send(user)
  } catch (error) {
    res.status(404).send("error saving the user:" + err.message)
  }
})

//.  delete
app.delete("/user", async (req, res) => {
  const userId = req.body.userId
  try {
    const deleteUser = await User.findOneAndDelete(userId)
    // const deleteUser = await User.findByIdAndDelete({ _id: userId })
    res.status(201).send("UserDeleted Successfully")
  } catch (error) {
    res.status(400).send("Deletion Failed:", error)
  }
})

//.  patch
app.patch("/user", async (req, res) => {
  const data = req.body;
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "after", runValidators: true })
    res.status(201).send("user updated successfully")
  } catch (error) {
    res.status(400).send("failed to update:" + error.message)
  }
})

connectDB().then(() => {
  console.log("Database connected successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failed:", err)
})

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });