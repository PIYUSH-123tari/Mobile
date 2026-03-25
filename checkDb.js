const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Region = require("./model/Region");

const checkData = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB Atlas.");

    // The connection string is missing the DB name, so it defaults to "test".
    // Let's see what DB we are actually connected to:
    console.log("Connected Database Name:", mongoose.connection.name);

    // Now let's explicitly look in the "ecoloop" database if we aren't already there
    const ecoloopDb = mongoose.connection.useDb("ecoloop");
    
    const ecoloopRegions = await ecoloopDb.collection("regions").find({}).toArray();
    console.log(`\nFound ${ecoloopRegions.length} regions in 'ecoloop' database:`);
    console.log(JSON.stringify(ecoloopRegions, null, 2));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkData();
