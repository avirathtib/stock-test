const router = require("express").Router();

const Watchlist = require("../models/Watchlist");

router.post("/", async (req, res) => {
  const watchlist = new Watchlist({
    title: req.body.title,
    ticker: req.body.ticker,
  });
  try {
    const newData = await watchlist.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  Watchlist.find((err, data) => {
    if (err) {
      res.status(501).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

module.exports = router;
