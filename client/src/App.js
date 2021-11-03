import "./App.css";
import React, { useState, useEffect } from "react";
import { TickerSymbolSearch } from "ticker-symbol-search";
import yahooFinance from "yahoo-finance2";
import axios from "./axios";
const stocks = require("stock-ticker-symbol");

const customTheme = {
  paper: {
    background: "rgba(128, 128, 128, 0.75)",
    color: "white",
  },
  search: {
    icon: {
      color: "rgba(188, 204, 221, 0.25)",
    },
    input: {
      color: "white",
      placeholderColor: "rgba(188, 204, 221, 0.25)",
    },
  },
  markets: {
    background: "rgba(0, 0, 0, 0.25)",
    color: "white",
  },
  selector: {
    color: "white",
  },
};

function App() {
  const [stock, setStock] = useState(null);
  const [ticker, setTicker] = useState("");
  const [title, setTitle] = useState("");
  const [runwatchlist, setRunwatchlist] = useState(false);
  const [stocklist, setStocklist] = useState([
    { _id: "", title: "", ticker: "", __v: 0 },
  ]);
  const [buyPrice, setBuyPrice] = useState(0);

  const gain = 0;

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.json())
      .then((res) => {
        setStocklist(res);
      });
  }, [runwatchlist]);

  const clickHandler = () => {
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5saqfaad3ia8bfblt0g`
    )
      .then((res) => res.json())
      .then((res) => {
        setStock(res.c);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clickBuyHandler = () => {
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5saqfaad3ia8bfblt0g`
    )
      .then((res) => res.json())
      .then((res) => {
        setBuyPrice(res.c);
        console.log(res.c);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clickSellHandler = () => {
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5saqfaad3ia8bfblt0g`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res.c - buyPrice);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addWatchlistHandler = () => {
    setRunwatchlist(!runwatchlist);
    axios
      .post("/", {
        title: title,
        ticker: ticker,
      })
      .then(function (response) {
        console.log(response);
      });
  };

  return (
    <div className="App">
      <TickerSymbolSearch
        callback={(data) => {
          setTicker(data.symbol.substring(4, data.symbol.length - 5));
          setTitle(data.description);
        }}
        theme={customTheme} // optional
      />
      <h1> We're going to win </h1>
      <button onClick={clickHandler}>Click Me Now Please</button>
      <p>{stock}</p>
      <button onClick={clickBuyHandler}>Buy</button>
      <button onClick={clickSellHandler}>Sell</button>
      <p>Stock return: {gain} </p>
      <div>
        <p>Add to watchlist</p>
        <button onClick={addWatchlistHandler}>+</button>
      </div>
      {!(stocklist.length === 0) &&
        stocklist.map((stock) => {
          return (
            <div>
              <p>{stock.title}</p>
              <p>{stock.ticker}</p>
            </div>
          );
        })}
    </div>
  );
}

export default App;
