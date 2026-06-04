const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const PORT = 5555;

app.use(express.json())

app.post("/signup", async (req, res) => {
  // console.log(req.body);

  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send("user created Successfully")
  } catch (error) {
    res.status(400).send("error saving the user:" + err.message)
  }
})


// feed API get all users data
app.get("/feed", async (req, res) => {
  const useremail = req.body
  try {
    const user = await User.find(useremail)
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