const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");
const { updatePickup } = require("../controller/pickupUpdateController");

router.put("/:id", authMiddleware, upload.single("image"), updatePickup);

module.exports = router;
