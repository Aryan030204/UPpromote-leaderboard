const mongoose = require("mongoose");

const affiliateSnapshotSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
  },
  {
    _id: false,
  }
);

const referralSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true },
    order_number: { type: String, required: true },
    affiliate: {
      type: affiliateSnapshotSchema,
      required: true,
      ref: "Affiliate",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Referral", referralSchema);
