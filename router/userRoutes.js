const express = require("express");
const router = express.Router();
const { registerUser,logoutUser,loginController } = require("../controller/userController");
const Region = require("../model/Region"); // ✅ ADDED

router.post("/register", registerUser);
router.get("/logout",logoutUser);
router.post("/login",loginController);

// ✅ NEW ROUTE TO FETCH REGIONS
router.get("/regions", async (req, res) => {
  try {
    const regions = await Region.find();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
