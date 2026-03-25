const express = require("express");
const router = express.Router();
const Category = require("../model/Category");

router.get("/all", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

module.exports = router;