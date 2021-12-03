import "./App.css";
import Details from "./Details";

import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { TickerSymbolSearch } from "ticker-symbol-search";
import yahooFinance from "yahoo-finance2";
import axios from "./axios";
import { Redirect } from "react-router";
import SearchBar from "./SearchBar";
import { TickerContext } from "./App";
import { UserContext } from "./App";
import { Link, useHistory } from "react-router-dom";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "./contexts/AuthContext";
import { db } from "./firebase";

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

function Home() {
  const [stock, setStock] = useState(null);
  const { ticker, setTicker } = useContext(TickerContext);
  const { email, setEmail } = useContext(UserContext);
  const [tickerquery, setTickerquery] = useState("");
  const [title, setTitle] = useState("");
  const [runwatchlist, setRunwatchlist] = useState(false);
  const [stocklist, setStocklist] = useState([]);
  const [buyPrice, setBuyPrice] = useState(0);
  const [newstocklist, setNewStocklist] = useState([]);

  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  const gain = 0;
  let stocks = [];

  useEffect(() => {
    getUserWatchlist(email);
  }, []);

  async function getUserWatchlist(email) {
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!query.empty) {
      const list = db
        .collection("users")
        .doc(query.docs[0].id)
        .collection("watchlist")
        .get()
        .then(function (querySnapshot) {
          stocks = querySnapshot.docs
            .map((doc) => doc.data())
            .map((data) => {
              return { title: data.title, ticker: data.ticker };
            });
          console.log(stocks);
        });
      setStocklist(stocks);
    }
  }

  const listItems = stocklist.map((stockname) => (
    <li>
      {stockname.title} : {stockname.ticker}
    </li>
  ));

  const clickHandler = () => {
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5saqfaad3ia8bfblt0g`
    )
      .then((res) => res.json())
      .then((res) => {
        setStock(res.c);

        <Redirect to={ticker} />;
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
      {console.log(stocks)}
      {console.log(stocklist)}
      <SearchBar placeholder="Enter a Stock.." />

      <h1> We're going to win </h1>
      <p>{email}</p>
      <button onClick={clickHandler}>Click Me Now Please</button>
      <p>{ticker}</p>
      <Link to={`/${ticker}`}>View Stock</Link>
      <p>{stock}</p>
      <button onClick={clickBuyHandler}>Buy</button>
      <button onClick={clickSellHandler}>Sell</button>
      <p>Stock return: {gain} </p>
      <div>
        <p>Add to watchlist</p>
        <button onClick={addWatchlistHandler}>+</button>
      </div>
      <div>{listItems}</div>
      <div>
        <Link to={`/profile`}>Profile</Link>

        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default Home;
