const express = require("express");
const cookieParser = require("cookie-parser");

// Global middlewares
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

// Routes imports
const authRouter = require("./modules/auth/auth.routes");
const feedRouter = require("./modules/feed/feed.routes");
const profileRouter = require("./modules/profiles/profile.routes");
const requestRouter = require("./modules/connectionRequests/connectionRequest.routes");
const userRouter = require("./modules/users/user.routes");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Register API routes
app.use("/", authRouter);
app.use("/", feedRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// 404 handler
app.use(notFound);

// Central error handler
app.use(errorHandler);

module.exports = app;