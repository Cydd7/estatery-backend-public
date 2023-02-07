const express = require("express");
const axios = require("axios");
const apicache = require("apicache");

const router = express.Router();
const estatery = axios.default;
const cache = apicache.middleware;

// Fetching unsplash images
router.get("/:keyword/:numofpages", cache("30 minutes"), async (req, res) => {
  try {
    let imagesData = [];
    let pages = [];
    let numofpages = req.params.numofpages;

    for (let i = 1; i <= numofpages; i++) {
      pages.push(i);
    }

    let promises = [];
    for (let pageNo = 1; pageNo <= numofpages; pageNo++) {
      promises.push(
        estatery.get("https://api.unsplash.com/search/photos", {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`,
          },
          params: {
            query: req.params.keyword,
            order_by: "relevant",
            per_page: 30,
            page: pageNo,
            orientation: "landscape",
          },
        })
      );
    }

    Promise.all(promises)
      .then((responses) => {
        const temp = responses.map((response) => {
          if (response !== undefined) {
            return response.data.results.map((item) => {
              return { rawurl: item.urls.raw };
            });
          } else {
            throw Error("Response is undefined");
          }
        });

        imagesData = temp.flat(1);
        res.status(200).json({ unsplashImagesData: imagesData });
      })
      .catch((errors) => {
        console.log("Error object after Promise.all: ", errors);
        res.status(500).json({ ErrorPromiseAll: errors });
      });
  } catch (e) {
    res.status(500).json({ ErrorTryCatch: e });
  }
});

module.exports = router;
