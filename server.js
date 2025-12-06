const express = require("express");
const app = express();
const connect_db = require("./config/db");

connect_db();
app.use(express.json());
require("dotenv").config();

app.post("/upromote/webhook", async (req, res) => {
  console.log("Webhook received:", req);

  // TODO: validate signature (if UpPromote sends one)
  // TODO: save to DB

  res.status(200).send("OK");
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
