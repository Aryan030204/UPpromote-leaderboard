const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Affiliate", affiliateSchema);
