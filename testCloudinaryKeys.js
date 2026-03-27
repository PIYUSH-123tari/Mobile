require("dotenv").config();
const { cloudinary } = require("./config/cloudinary");

async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload("j.txt", {
      folder: "ecoloop_test",
      resource_type: "raw"
    });
    console.log("SUCCESS:", result.secure_url);
  } catch (error) {
    console.error("ERROR:", error.message || error);
  }
}

testUpload();
