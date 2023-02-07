const express = require("express");

const User = require("../models/user");
const { getPropertyMiddleware } = require("./properties");
const userData = require("../utility/userData");

const router = express.Router();

// Getting all
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
 * Learings - Creating a same route with same method but different middleware functions
 * can cause error and conflict.
 * (eg: below patch and /:userid are used together two times so it creates a conflict.
 * If saving property function is written after booking property function, then saving
 * property will execute. It is better to use different routes for different functions.)
 */

// Saving property
router.patch("/save/:userid", getUserMiddleware, async (req, res) => {
  if (req.body.savedPropertyId != null && res.user != null) {
    if (
      !res.user.savedProperties.some((prop) => {
        return prop === req.body.savedPropertyId;
      })
    ) {
      res.user.savedProperties.push(req.body.savedPropertyId);
    }
  }
  try {
    const updatedUser = await res.user.save();
    res.status(200).json({ updatedUser: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Unsaving property
router.patch("/unsave/:userid/:propid", getUserMiddleware, async (req, res) => {
  if (res.user != null) {
    res.user.savedProperties = res.user.savedProperties.filter(
      (item) => item != req.params.propid
    );
  }
  try {
    const updatedUser = await res.user.save();
    res.status(200).json({ updatedUser: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Booking property
router.patch(
  "/book/:userid",
  getUserMiddleware,
  getPropertyMiddleware,
  async (req, res) => {
    if (
      req.body.bookedProperty != null &&
      res.user != null &&
      res.property != null
    ) {
      if (
        !res.user.bookedProperties.some((prop) => {
          return prop.propid === req.body.bookedProperty.propid;
        })
      ) {
        res.user.bookedProperties.push(req.body.bookedProperty);
        res.property.booked = true;
      }
    }

    try {
      const updatedUser = await res.user.save();
      const updatedProperty = await res.property.save();
      res
        .status(200)
        .json({ updatedUser: updatedUser, updatedProperty: updatedProperty });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Canceling booking
router.patch(
  "/cancel/:userid/:propid",
  getUserMiddleware,
  getPropertyMiddleware,
  async (req, res) => {
    if (res.user != null && res.property != null) {
      res.user.bookedProperties = res.user.bookedProperties.filter(
        (item) => item.propid != req.params.propid
      );
      res.property.booked = false;
    }
    try {
      const updatedUser = await res.user.save();
      const updatedProperty = await res.property.save();
      res
        .status(200)
        .json({ updatedUser: updatedUser, updatedProperty: updatedProperty });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

async function getUserMiddleware(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.userid);
    if (user == null) {
      res.status(404).json({ message: "Cannot find User" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();

  return;
}

// router.post("/addall", async (req, res) => {
//   try {
//     const Bulk = await User.insertMany(userData);
//     res.status(201).json(Bulk);
//   } catch (error) {
//     res.status(400).json({
//       message: error,
//       datatype: typeof userData,
//     });
//   }
// });

module.exports = router;
