const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path = require("path"); // ✅ ADD THIS

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SERVE FRONTEND
app.use(express.static(path.join(__dirname, "view")));

// default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "Homepage", "index.html"));
});

const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/users", require("./router/userRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/pickup", require("./router/pickupRoutes"));
app.use("/pickupHistory", require("./router/pickupHistoryRoutes"));
app.use("/pickup/update", require("./router/pickupUpdateRoutes"));
app.use("/pickup/delete", require("./router/pickupDeleteRoutes"));
app.use("/userProfile", require("./router/userProfileRoutes"));
app.use("/category", require("./router/categoryRoutes"));
app.use("/reward", require("./router/rewardRoutes"));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});