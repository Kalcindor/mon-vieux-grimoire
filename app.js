const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res) => {
  res.json({ message: "Valid response" });
});

module.exports = app;
