const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  const id = req.query.id;
  const query = "SELECT * FROM users WHERE id = " + id; // 🚨 SQL Injection
  res.send(query);
});

app.listen(3000);