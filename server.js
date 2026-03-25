const express = require("express");
const connectDB = require("./config/db");
const cors=require("cors");

const corsOptions=require("./config/corsOptions");

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/users", require("./router/userRoutes"));
app.use("/uploads",express.static("uploads"));
app.use("/pickup", require("./router/pickupRoutes"));
app.use("/pickupHistory", require("./router/pickupHistoryRoutes"));
app.use("/pickup/update", require("./router/pickupUpdateRoutes"));
app.use("/pickup/delete", require("./router/pickupDeleteRoutes"));
app.use("/userProfile", require("./router/userProfileRoutes"));

app.use("/category", require("./router/categoryRoutes"));
app.use("/reward",         require("./router/rewardRoutes"));



app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// reward_points: { type: Number, default: 0 },
// created_at: { type: Date, default: Date.now }