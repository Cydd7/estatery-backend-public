const express = require("express");
const apicache = require("apicache");

const Location = require("../models/location");
const loactionData = require("../utility/loactionData");

const router = express.Router();
const cache = apicache.middleware;

// Getting all
router.get("/", cache("30 minutes"), async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.post("/addall", async (req, res) => {
//   try {
//     const BulkLocations = await Location.insertMany(loactionData);
//     res.status(201).json(BulkLocations);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;
