const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const PORT = 5555;



app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: 'soumen',
    lastName: "mondal",
    emailId: "soumen@gmail.com",
    password: "soumen123"

  }
  const user = new User(userObj)
  try {
    await user.save()
  res.status(201).send("user created Successfully")
  } catch (error) {
    res.status(400).send("error saving the user:"+ err.message)
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