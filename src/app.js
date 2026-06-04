const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const PORT = 5555;

app.use(express.json())

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  const { emailId, ...rest } = req.body;
  try {
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email Id already present.")
    }
    const user = new User({ emailId, ...rest })
    await user.save()
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error: error.message });
  }

})

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