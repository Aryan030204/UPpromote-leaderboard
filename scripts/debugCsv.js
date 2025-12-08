const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const CSV_FILE = path.join(__dirname, "../assets/Top_affiliates_analytics.csv");

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on("data", (row) => {
    console.log("Row keys:", Object.keys(row));
    console.log("First row content:", row);
    process.exit(0); // Exit after first row
  });
