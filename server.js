require("dotenv").config();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
const connect_db = require("./config/db");
const Referral = require("./models/Referral");
const Affiliate = require("./models/Affiliate");

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";
const LEADERBOARD_LIMIT = 10;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://upromote-leaderboard.vercel.app",
    ],
  })
);

let leaderboardCache = [];

const sortEntries = (a, b) => {
  if (b.numberOfOrders === a.numberOfOrders) {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  }
  return b.numberOfOrders - a.numberOfOrders;
};

const toLeaderboardEntry = (doc) => ({
  _id: doc._id?.toString(),
  id: doc.id,
  first_name: doc.first_name,
  last_name: doc.last_name,
  numberOfOrders: doc.numberOfOrders,
  updatedAt: doc.updatedAt,
});

const refreshLeaderboardCache = async () => {
  const docs = await Affiliate.find(
    {},
    "id first_name last_name numberOfOrders updatedAt"
  )
    .sort({ numberOfOrders: -1, updatedAt: -1 })
    .limit(LEADERBOARD_LIMIT)
    .lean();

  leaderboardCache = docs.map(toLeaderboardEntry);
  return leaderboardCache;
};

const ensureLeaderboardCache = async () => {
  if (!leaderboardCache.length) {
    await refreshLeaderboardCache();
  }
  return leaderboardCache;
};

const applyAffiliateToCache = (doc) => {
  if (!doc) return false;
  const entry = toLeaderboardEntry(doc);
  const existingIndex = leaderboardCache.findIndex(
    (item) => item.id === entry.id
  );

  if (existingIndex !== -1) {
    leaderboardCache[existingIndex] = entry;
  } else {
    leaderboardCache.push(entry);
  }

  leaderboardCache.sort(sortEntries);
  leaderboardCache = leaderboardCache.slice(0, LEADERBOARD_LIMIT);
  return leaderboardCache.some((item) => item.id === entry.id);
};

connect_db().then(refreshLeaderboardCache).catch(console.error);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN },
});

io.on("connection", async (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  await ensureLeaderboardCache();
  socket.emit("leaderboard:init", { leaderboard: leaderboardCache });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

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

    const existingAffiliate = await Affiliate.findOne({ email });
    if (existingAffiliate && existingAffiliate.id !== String(id)) {
      return res.status(400).json({
        message: "Affiliate with this email already exists",
      });
    }

    await Referral.create({
      order_id: String(order_id),
      order_number: String(order_number),
      affiliate: affiliateSnapshot,
    });

    const affiliateDoc = await Affiliate.findOneAndUpdate(
      { id: affiliateSnapshot.id },
      {
        $setOnInsert: affiliateSnapshot,
        $inc: { numberOfOrders: 1 },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const isOnLeaderboard = applyAffiliateToCache(affiliateDoc);
    if (isOnLeaderboard) {
      io.emit("leaderboard:update", {
        updatedAffiliate: toLeaderboardEntry(affiliateDoc),
        leaderboard: leaderboardCache,
      });
    }

    res.status(201).json({ message: "Referral recorded" });
  } catch (error) {
    console.error("Failed to process UpPromote webhook", error);
    res.status(500).json({ message: "Failed to record referral" });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    await ensureLeaderboardCache();
    res.json({ leaderboard: leaderboardCache });
  } catch (error) {
    console.error("Failed to fetch leaderboard", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
