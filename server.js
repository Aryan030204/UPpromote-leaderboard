const express = require("express");
const app = express();
app.use(express.json());

app.post("/upromote/webhook", async (req, res) => {
  console.log("Webhook received:", req.body);

  // TODO: validate signature (if UpPromote sends one)
  // TODO: save to DB

  res.status(200).send("OK");
});

app.listen(3000, () => console.log("Server running on port 3000"));
