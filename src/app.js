const express = require("express");
const connectDB = require("./config/database")
const app = express();
const PORT = 5555;



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