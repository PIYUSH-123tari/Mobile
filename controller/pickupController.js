const PickupRequest = require("../model/PickupRequest");
const User = require("../model/User");

const createPickup = async (req, res) => {
  try {

    const {
      userId,
      userPhone,
      category,
      waste_description,
      additional_phone_no,
      estimated_weight,
      pickup_address,
      preferred_date
    } = req.body;

    // 1️⃣ Find user using UUID
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Create pickup
    const pickup = new PickupRequest({
      user: user._id,                 // ObjectId reference
      region_Id: user.region_Id,      // copied from user
      userPhone: userPhone,
      additional_phone_no: additional_phone_no || null,

      category: category,             // Category ObjectId
      waste_description: waste_description,

      estimated_weight,
      pickup_address,
      preferred_date,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await pickup.save();

    res.status(201).json({
      message: "Pickup request created successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPickup };