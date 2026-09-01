const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Global middlewares
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");

// Routes imports
const authRouter = require("./modules/auth/auth.routes");
const feedRouter = require("./modules/feed/feed.routes");
const profileRouter = require("./modules/profile/profile.routes");
const requestRouter = require("./modules/connectionRequest/connectionRequest.routes");
const userRouter = require("./modules/user/user.routes");

const app = express();

app.use(
  cors({
    origin: true, // Allow any incoming origin for local development
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Register API routes
app.use("/api/v1", authRouter);
app.use("/api/v1", feedRouter);
app.use("/api/v1", profileRouter);
app.use("/api/v1", requestRouter);
app.use("/api/v1", userRouter);

// 404 handler
app.use(notFound);

// Central error handler
app.use(errorHandler);

module.exports = app;