const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { deletePickup } = require("../controller/pickupDeleteController");

router.delete("/:id", authMiddleware, deletePickup);

module.exports = router;
