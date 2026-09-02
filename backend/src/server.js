require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");
const { PORT } = require("./config/env");

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
