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
import UserInput from "./components/UserInput";
import styled from "styled-components";
import firebase from "firebase";
import x from "./images/x.png";
import BuySellModal from "./components/BuySellModal";
import CloseButton from "./components/CloseModalButton";

const UserInputDiv = styled.div`
  display: flex;
  flex-grow: 1;
  width: calc(50%);
  flex-direction: column;
`;

const AddUserDiv = styled.div`
  align-items: center;
  justify-content: center;
`;

const CloseButtonImg = styled.img`
  max-width: 40%;
  object-fit: contain;
`;

const AddUserTitle = styled.h1`
  width: 100%;
  font-size: 2.5em;
  margin: 0px;
  color: #080f14;
  text-align: center;
`;

const AddUserLabel = styled.p`
  margin-bottom: 2px;
`;

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
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const { email, setEmail } = useContext(UserContext);
  const [numberOfWeeks, setNumberOfWeeks] = useState("");
  const [newLeague, setNewLeague] = useState("");
  const [existingLeague, setExistingLeague] = useState("");
  const [title, setTitle] = useState("");
  const [runwatchlist, setRunwatchlist] = useState(false);
  const [stocklist, setStocklist] = useState([]);
  const [buyPrice, setBuyPrice] = useState(0);
  const [portfolioPrices, setPortfolioPrices] = useState([]);
  const [portfolioPricesObj, setPortfolioPricesObj] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  const [error, setError] = useState("");
  const [leagueList, setLeagueList] = useState([]);
  const [personalLeagueList, setPersonalLeagueList] = useState([]);
  const [showLeagueError, setShowLeagueError] = useState(false);
  const [showExistingLeagueError, setShowExistingLeagueError] = useState(false);
  const [playerName, setPlayerName] = useState("");

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
  let stocksPortfolio = [];

  function openNewUserModal() {
    setShowNewUserModal(true);
  }

  function closeNewUserModal() {
    setShowNewUserModal(false);
  }

  useEffect(() => {
    console.log("Hello from the first useEffect");
    getUserWatchlist(email);
    getUserPortfolio(email);
    getLeagues();
    getPersonalLeagueList(email);
    getUserByEmail(email);
  }, []);

  useEffect(() => {
    console.log(portfolioPricesObj);
    console.log("Hello from the second useEffect");
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [portfolioPricesObj]);

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
          setStocklist(stocks);
        });
    }
  }
  async function getUserByEmail(email) {
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    console.log(query);
    if (!query.empty) {
      const snapshot = query.docs[0];
      const data = snapshot.data();
      setPlayerName(data.name);
    } else {
      console.log("Error");
    }
  }

  let leagues = [];

  async function getLeagues() {
    db.collection("leagues")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          leagues.push(doc.data().leagueName);

          setLeagueList(leagues);
        });
      });
  }

  let newtemp = [];
  async function getPersonalLeagueList(email) {
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!query.empty) {
      const portfolioList = db
        .collection("users")
        .doc(query.docs[0].id)
        .collection("leaguesEntered")
        .get()
        .then(function (querySnapshot) {
          newtemp = querySnapshot.docs
            .map((doc) => doc.data())
            .map((data) => {
              return {
                name: data.name,
              };
            });
          setPersonalLeagueList(newtemp);
        });
    }

    console.log(personalLeagueList);
  }
  const listItems = stocklist.map((stockname) => (
    <li>
      {stockname.title} : {stockname.ticker}
    </li>
  ));

  const personalLeagueItems = personalLeagueList.map((league) => (
    <li>
      <Link to={`/leagues/${league.name}`}>{league.name}</Link>
    </li>
  ));

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

  async function getUserPortfolio(email) {
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (!query.empty) {
      const portfolioList = db
        .collection("users")
        .doc(query.docs[0].id)
        .collection("buyhistory")
        .get()
        .then(function (querySnapshot) {
          stocksPortfolio = querySnapshot.docs
            .map((doc) => doc.data())
            .map((data) => {
              return {
                title: data.title,
                ticker: data.ticker,
                quantity: data.quantity,
                pricePerShare: data.pricePerShare,
                totalPrice: data.totalPrice,
              };
            });
          setPortfolio(stocksPortfolio);
        });
    }
  }

  const loadData = () => {
    loadData.counter = 0;
    let tempPriceForObj = [];
    portfolio.map((stockname) => {
      fetch(
        `https://finnhub.io/api/v1/quote?symbol=${stockname.ticker}&token=c5saqfaad3ia8bfblt0g`
      )
        .then((res) => res.json())
        .then((res) => {
          tempPriceForObj.push({
            title: stockname.title,
            ticker: stockname.ticker,
            currentprice: res.c,
            return: (res.c - stockname.pricePerShare) * stockname.quantity,
          });
        });
    });

    setPortfolioPricesObj(tempPriceForObj);

    console.log(portfolioPricesObj);
  };

  async function joinNewLeagueHandler() {
    let templist = leagueList;
    setShowLeagueError(false);
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (leagueList.includes(newLeague)) {
      setShowLeagueError(true);
    } else {
      const addQuery = await db.collection("leagues").doc(newLeague).set({
        leagueName: newLeague,
        time: numberOfWeeks,
      });

      const queryForPlayersCollection = await db
        .collection("leagues")
        .doc(newLeague)
        .collection("players")
        .add({
          id: query.docs[0].id,
          name: playerName,
        });
      setLeagueList({ ...leagueList, newLeague });

      const addQuery2 = await db
        .collection("users")
        .doc(query.docs[0].id)
        .collection("leaguesEntered")
        .add({
          name: newLeague,
        });
    }
  }

  async function joinExistingLeagueHandler() {
    setShowExistingLeagueError(false);
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (leagueList.includes(existingLeague)) {
      const updateOldQuery = await db
        .collection("leagues")
        .doc(existingLeague)
        .collection("players")
        .add({
          id: query.docs[0].id,
          name: playerName,
        });

      const addQuery2 = await db
        .collection("users")
        .doc(query.docs[0].id)
        .collection("leaguesEntered")
        .add({
          name: existingLeague,
        });
    } else {
      setShowExistingLeagueError(true);
    }
  }

  return (
    <div className="App">
      <SearchBar placeholder="Enter a Stock.." />

      <h1> We're going to win </h1>
      <p>{email}</p>

      <p>WATCHLIST</p>
      <div>{listItems}</div>
      <p>PORTFOLIO</p>
      {/* {portfolioPricesObj &&
        portfolioPricesObj.map((stockname) => {
          console.log(stockname);
          return (
            <div>
              <p>{stockname}</p>
            </div>
          );
        })} */}

      <p>LEAGUES</p>
      <div>{personalLeagueItems}</div>

      <div>
        <Link to={`/profile`}>Profile</Link>
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      <UserInputDiv>
        <p>Create new league</p>
        <UserInput
          value={newLeague}
          onChange={(e) => {
            setNewLeague(e.target.value.toString());
          }}
        />

        <Button onClick={openNewUserModal}>Join</Button>
        {showLeagueError ? (
          <>
            <p>League already exists</p>
          </>
        ) : (
          <></>
        )}

        <p>Join existing league</p>
        <UserInput
          value={existingLeague}
          onChange={(e) => {
            setExistingLeague(e.target.value);
          }}
        />
        <Button onClick={joinExistingLeagueHandler}>Join</Button>

        {showExistingLeagueError ? (
          <>
            <p>League does not exist</p>
          </>
        ) : (
          <></>
        )}
      </UserInputDiv>
      <BuySellModal
        isOpen={showNewUserModal}
        onRequestClose={closeNewUserModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.3)",
          },
          content: {
            backgroundColor: "#fff",
            borderRadius: 0,
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "420px",
            height: "513px",
          },
        }}
      >
        <AddUserDiv>
          <CloseButton onClick={() => closeNewUserModal()}>
            <CloseButtonImg src={x} />
          </CloseButton>
          <AddUserTitle>Add Timing</AddUserTitle>
          <UserInputDiv>
            <AddUserLabel>Number of Weeks</AddUserLabel>
            <UserInput
              value={numberOfWeeks}
              onChange={(e) => {
                setNumberOfWeeks(e.target.value);
              }}
            />
          </UserInputDiv>
          <Button onClick={joinNewLeagueHandler}>Confirm Timing</Button>
        </AddUserDiv>
      </BuySellModal>
    </div>
  );
}

export default Home;
