const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Region = require("./model/Region");

const regionsToSeed = [
  { region_name: "Andheri", state: "Maharashtra" },
  { region_name: "Bandra", state: "Maharashtra" },
  { region_name: "Borivali", state: "Maharashtra" },
  { region_name: "Colaba", state: "Maharashtra" },
  { region_name: "Dadar", state: "Maharashtra" },
  { region_name: "Goregaon", state: "Maharashtra" },
  { region_name: "Juhu", state: "Maharashtra" },
  { region_name: "Kandivali", state: "Maharashtra" },
  { region_name: "Kurla", state: "Maharashtra" },
  { region_name: "Malad", state: "Maharashtra" },
  { region_name: "Powai", state: "Maharashtra" },
  { region_name: "Thane", state: "Maharashtra" },
  { region_name: "Vashi", state: "Maharashtra" }
];

const seedRegions = async () => {
  try {
    await connectDB();
    console.log("Connected. Checking existing regions...");
    
    // Clear existing if any
    await Region.deleteMany({});
    
    // Insert new
    await Region.insertMany(regionsToSeed);
    console.log(`Successfully seeded ${regionsToSeed.length} regions.`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding regions:", error);
    process.exit(1);
  }
};

seedRegions();
