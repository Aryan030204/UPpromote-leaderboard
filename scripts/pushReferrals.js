const axios = require("axios");

const WEBHOOK_URL =
  process.env.WEBHOOK_URL || "https://uppromote-leaderboard.onrender.com/upromote/webhook";
const INTERVAL_MS = Number(process.env.INTERVAL_MS) || 10000;
const MIN_BATCH_SIZE = Number(process.env.MIN_BATCH_SIZE) || 2;
const MAX_BATCH_SIZE = Number(process.env.MAX_BATCH_SIZE) || 5;
const REUSE_EXISTING_PROB = Number(process.env.REUSE_EXISTING_PROB ?? 0.5);
const reuseProbability = Math.min(Math.max(REUSE_EXISTING_PROB, 0), 1);

const firstNames = [
  "Aryan",
  "Priya",
  "Meera",
  "Amit",
  "Vikas",
  "Rajesh",
  "Neha",
  "Sonia",
  "Kabir",
  "Anya",
];

const lastNames = [
  "Sharma",
  "Singh",
  "Jain",
  "Kumar",
  "Reddy",
  "Nair",
  "Bhatt",
  "Patel",
  "Khanna",
  "Iyer",
];

const affiliatePool = [];

const randomItem = (collection) =>
  collection[Math.floor(Math.random() * collection.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const slugify = (value) => value.toLowerCase().replace(/[^a-z]/g, "");

const createAffiliate = () => {
  const first_name = randomItem(firstNames);
  const last_name = randomItem(lastNames);
  const id = `${first_name[0]}${last_name[0]}${randomInt(1000, 9999)}`;
  const email = `${slugify(first_name)}.${slugify(last_name)}${randomInt(
    1,
    99
  )}@demo.io`;

  return { id, email, first_name, last_name };
};

const pickAffiliate = () => {
  if (affiliatePool.length && Math.random() < reuseProbability) {
    return randomItem(affiliatePool);
  }
  const freshAffiliate = createAffiliate();
  affiliatePool.push(freshAffiliate);
  return freshAffiliate;
};

const buildReferralPayload = (affiliate) => ({
  order_id: `ORD-${Date.now()}-${randomInt(100, 999)}`,
  order_number: randomInt(10000, 99999),
  quantity: randomInt(1, 3),
  total_sales: randomInt(5000, 75000).toFixed(2),
  commission_rule: {
    program_id: randomInt(200000, 300000),
    commission_rate: randomInt(2, 20).toFixed(2),
    commission_type: "Percent Of Sale",
  },
  commission_adjustment: "0.00",
  status: "approved",
  commission: randomInt(100, 1000).toFixed(2),
  refund_id: null,
  tracking_type: "Tracked by coupon",
  affiliate: { ...affiliate },
  coupon_applied: `COUPON-${randomInt(1000, 9999)}`,
  customer_email: `${slugify(affiliate.first_name)}.${slugify(
    affiliate.last_name
  )}${randomInt(1, 99)}@customer.io`,
  created_at: new Date().toISOString(),
});

const sendReferral = async (affiliate) => {
  const payload = buildReferralPayload(affiliate);
  const label = `${affiliate.first_name} ${affiliate.last_name} (${affiliate.id})`;
  try {
    await axios.post(WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`Sent referral for ${label}`);
  } catch (error) {
    const details = error.response?.data || error.message;
    console.error(`Failed to send referral for ${label}:`, details);
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendBatch = async () => {
  const batchSize = randomInt(MIN_BATCH_SIZE, MAX_BATCH_SIZE);
  const suffix = batchSize === 1 ? "" : "s";
  console.log(
    `[${new Date().toISOString()}] Dispatching ${batchSize} referral${suffix}...`
  );

  for (let i = 0; i < batchSize; i += 1) {
    await sendReferral(pickAffiliate());
  }
};

const start = async () => {
  console.log(
    `Streaming referrals every ${INTERVAL_MS / 1000}s (batch size ${MIN_BATCH_SIZE}-${MAX_BATCH_SIZE}). Press CTRL+C to stop.`
  );

  while (true) {
    await sendBatch();
    console.log("Waiting for next batch...\n");
    await wait(INTERVAL_MS);
  }
};

process.on("SIGINT", () => {
  console.log("\nStopping referral generator. Bye!");
  process.exit(0);
});

start().catch((error) => {
  console.error("Referral generator failed", error);
  process.exit(1);
});
