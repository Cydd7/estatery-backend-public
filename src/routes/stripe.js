const express = require("express");
const { getPropertyMiddleware } = require("./properties");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const router = express.Router();

// Creating a stripe checkout session
router.post("/:propid", getPropertyMiddleware, async (req, res) => {
  try {
    const months = Number(req.body.checkoutInfo.months);
    const itemData = {
      price_data: {
        currency: "usd",
        product_data: {
          name: res.property.name,
          images: [req.body.checkoutInfo.imageurl],
          description: res.property.address,
        },
        unit_amount: (res.property.price + 10) * 100,
      },
      quantity: months,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [itemData],
      success_url: `https://estatery-home.web.app/success/${
        req.params.propid
      }/${months}/${req.body.checkoutInfo.date}/${true}`,
      cancel_url: "https://estatery-home.web.app/fail",
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
