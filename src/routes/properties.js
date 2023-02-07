const express = require("express");

const Property = require("../models/property");
// const propertyData = require("../utility/propertyData");

const router = express.Router();

// Getting all
// ! Check this, may cause error in frontend
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getPropertyMiddleware(req, res, next) {
  let property = null;
  try {
    if (req.body.bookedProperty != null) {
      property = await Property.findById(req.body.bookedProperty.propid);
    } else {
      property = await Property.findById(req.params.propid);
    }
    if (property == null) {
      res.status(404).json({ message: "Cannot find property" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.property = property;
  next();

  return;
}

// router.post("/addall", async (req, res) => {
//   try {
//     const BulkProperties = await Property.insertMany(propertyData);
//     res.status(201).json(BulkProperties);
//   } catch (error) {
//     res.status(400).json({
//       message: error,
//       datatype: typeof propertyData,
//     });
//   }
// });

propertiesRouter = router;
module.exports = { propertiesRouter, getPropertyMiddleware };
