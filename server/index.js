const express = require("express");
const mongoose = require("mongoose");
const watchlistRoute = require("./routes/watchlist");
const app = express();
const Cors = require("cors");

mongoose
  .connect(
    "mongodb+srv://avirath:avirath@cluster0.7rohw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(Cors());
app.use("", watchlistRoute);

app.listen("5000", (req, res) => {
  console.log("Server is listening");
});
