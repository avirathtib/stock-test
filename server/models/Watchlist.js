const mongoose = require("mongoose");

const watchlistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  ticker: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = new mongoose.model("Watchlist", watchlistSchema);
