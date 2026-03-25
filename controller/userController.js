const User = require("../model/User");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/authMiddleware");
const Region = require("../model/Region"); // ✅ ADDED: Import Region model
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ecoloop229@gmail.com",
    pass: "auessmdhdfhsbveb"
  }
});

/* ================= REGISTER USER ================= */
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, region_Id } = req.body;

    // ✅ CHECK IF REGION EXISTS (NEW)
    const regionExists = await Region.findById(region_Id);
    if (!regionExists) {
      return res.status(400).json({ message: "Invalid region selected" });
    }

    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId: uuidv4(),
      name,
      email,
      phone,
      password: hashedPassword,
      region_Id: regionExists._id // ✅ STORE OBJECT ID
    });

    // Send Welcome Email (non-blocking — don't fail registration if email fails)
    try {
      await transporter.sendMail({
        from: "ecoloop229@gmail.com",
        to: email,
        subject: "Welcome to EcoLoop ♻",
        text: `Hello ${name},

Thank you for registering with EcoLoop ♻.
Together we make the planet cleaner 🌍

- Team EcoLoop`
      });
    } catch (emailErr) {
      console.warn("Welcome email failed (registration still succeeded):", emailErr.message);
    }

    res.status(201).json({
      message: "User registered successfully. Please login.",
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        region_Id: user.region_Id
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN USER ================= */
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // ✅ POPULATE REGION (NEW)
    const findUser = await User.findOne({ email }).populate("region_Id");

    if (!findUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: findUser.userId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: findUser.userId,
        name: findUser.name,
        email: findUser.email,
        phone: findUser.phone, // ✅ ADD THIS
        region_Id: findUser.region_Id._id,
        region_name: findUser.region_Id.region_name // ✅ SEND REGION NAME
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, logoutUser, loginController };