const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const connect_db = require("../config/db");
const Affiliate = require("../models/Affiliate");

// Connect to DB
connect_db();

const CSV_FILE = path.join(__dirname, "../assets/Top_affiliates_analytics.csv");

const results = [];

const cleanCurrency = (str) => {
  if (!str) return 0;
  // Remove ₹ and commas, then parse
  return parseFloat(str.replace(/[^0-9.-]+/g, ""));
};

const processedData = [];


const stripBom = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/^\uFEFF/, '');
};

fs.createReadStream(CSV_FILE)
  .pipe(csv({
      mapHeaders: ({ header }) => stripBom(header).trim()
  }))
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    console.log(`Parsed ${results.length} rows from CSV.`);

    for (const row of results) {
      try {
        const nameParts = row.affiliate_name ? row.affiliate_name.trim().split(/\s+/) : ["Unknown", "User"];
        let firstName = nameParts[0] || "Unknown";
        let lastName = nameParts.slice(1).join(" ") || "User";

        // Generate a simple ID logic
        const id = `AFF-${Date.now()}-${Math.floor(Math.random() * 10000)}_${processedData.length}`;
        
        const numberOfOrders = parseInt(row.total_referral) || 0;

        const affiliateData = {
          id: id,
          email: row.email || `noemail-${Date.now()}@example.com`,
          first_name: firstName,
          last_name: lastName,
          numberOfOrders: numberOfOrders
        };
        
        processedData.push(affiliateData);

      } catch (err) {
        console.error("Error processing row:", row, err);
      }
    }

    try {
      console.log("Clearing existing affiliates...");
      await Affiliate.deleteMany({});
      
      console.log(`Inserting ${processedData.length} affiliates...`);
      await Affiliate.insertMany(processedData);
      console.log("Data import completed successfully!");
      process.exit(0);
    } catch (err) {
      console.error("Error inserting data into MongoDB:", err);
      process.exit(1);
    }
  });
