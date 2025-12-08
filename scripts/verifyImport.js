const mongoose = require("mongoose");
const connect_db = require("../config/db");
const Affiliate = require("../models/Affiliate");

connect_db();

const checkData = async () => {
    try {
        const count = await Affiliate.countDocuments();
        console.log(`Total Affiliates: ${count}`);

        if (count === 0) {
            console.warn("WARNING: No affiliates found!");
            process.exit(1);
        }

        const samples = await Affiliate.find().limit(5);
        console.log("Sample Affiliates:");
        console.log(JSON.stringify(samples, null, 2));

        process.exit(0);
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
};

// Allow DB connection to establish
setTimeout(checkData, 1000);
