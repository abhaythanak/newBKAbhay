const express = require("express");
const app = express();
const PORT = 3001;
const { userAuth } = require("./auth");

app.get("/user", userAuth, (req, res) => {
  res.send({ name: "abhay", age: 21, gender: "male" });
});

app.use((err, req, res, next) => {
  res.status(500).send("Something went wrong");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});