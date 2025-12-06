require("dotenv").config();
const express = require("express");
const app = express();
const connect_db = require("./config/db");
const Referral = require("./models/Referral");
const Affiliate = require("./models/Affiliate");

connect_db();
app.use(express.json());

app.post("/upromote/webhook", async (req, res) => {
  try {
    console.log("Webhook received:", req.body);

    const { order_id, order_number, affiliate } = req.body || {};

    if (!order_id || !order_number || !affiliate) {
      return res.status(400).json({
        message: "Missing order_id, order_number, or affiliate data",
      });
    }

    const { id, email, first_name, last_name } = affiliate;

    if (!id || !email || !first_name || !last_name) {
      return res.status(400).json({
        message: "Incomplete affiliate information",
      });
    }

    const affiliateSnapshot = {
      id: String(id),
      email,
      first_name,
      last_name,
    };

    await Referral.create({
      order_id: String(order_id),
      order_number: String(order_number),
      affiliate: affiliateSnapshot,
    });

    await Affiliate.findOneAndUpdate(
      { id: affiliateSnapshot.id },
      {
        $setOnInsert: affiliateSnapshot,
        $inc: { numberOfOrders: 1 },
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: "Referral recorded" });
  } catch (error) {
    console.error("Failed to process UpPromote webhook", error);
    res.status(500).json({ message: "Failed to record referral" });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
