require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const { propertiesRouter } = require("./routes/properties");
const locationsRouter = require("./routes/locations");
const usersRouter = require("./routes/users");
const stripeRouter = require("./routes/stripe");
const unsplashRouter = require("./routes/unsplash");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, //60 min
  max: 150,
});

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => {
  console.log(error);
});
db.once("open", () => {
  console.log("Connected to db");
});

const router = express.Router();
router.get("/", (req, res) => {
  res.json({
    message: "Api is working!",
  });
});

const app = express();
app.use(limiter);
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.set("json spaces", 2);
app.use(`/.netlify/functions/api`, router);
app.use("/.netlify/functions/api/estatery/properties", propertiesRouter);
app.use("/.netlify/functions/api/estatery/locations", locationsRouter);
app.use("/.netlify/functions/api/estatery/users", usersRouter);
app.use(
  "/.netlify/functions/api/estatery/stripe-checkout-session",
  stripeRouter
);
app.use(
  "/.netlify/functions/api/estatery/fetch-unsplash-images",
  unsplashRouter
);

// app.listen(3001,()=>{console.log("Server Started")})

module.exports = app;
const handler = serverless(app);
module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
