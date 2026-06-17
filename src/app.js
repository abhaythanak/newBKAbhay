const express = require("express");
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user")
const { validateSignupData } = require("./utils/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const { userAuth } = require("./middlewares/auth")
const PORT = 5555;

app.use(express.json())
app.use(cookieParser())

// routes imports
const authRouter = require("./routers/auth")
const feedRouter = require("./routers/feed")
const profileRouter = require("./routers/profile")
const requestRouter = require("./routers/request")
const userRouter = require("./routers/user")

app.use("/", authRouter);
app.use("/", feedRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)


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