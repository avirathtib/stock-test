import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "./axios";
import { TickerContext } from "./App";
import { db } from "./firebase";
import { UserContext } from "./App";
import StockChart from "./StockChart";
import BuySellModal from "./components/BuySellModal";
import styled from "styled-components";
import CloseButton from "./components/CloseModalButton";
import x from "./images/x.png";
import UserInput from "./components/UserInput";

const stocks = require("stock-ticker-symbol");

const AddUserDiv = styled.div`
  align-items: center;
  justify-content: center;
`;

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 30px;
`;

const UserInputDiv = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
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

function Details() {
  const { ticker, setTicker } = useContext(TickerContext);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const { email, setEmail } = useContext(UserContext);
  const [numberOfShares, setNumberOfShares] = useState(0);
  const [runwatchlist, setRunwatchlist] = useState(false);
  const [buyPrice, setBuyPrice] = useState(0);
  const [latestPrice, setLatestPrice] = useState(0);
  const url =
    "https://finnhub.io/api/v1/quote?symbol=AAPL&token=c5saqfaad3ia8bfblt0g";

  const { id } = useParams();

  useEffect(() => {
    console.log(email);
    setTicker(stocks.searchName(id)[0].ticker);
  }, []);

  function openNewUserModal() {
    setShowNewUserModal(true);
  }

  function closeNewUserModal() {
    setShowNewUserModal(false);
  }

  const addWatchlistHandler = async () => {
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    // console.log("user id" + query.docs[0].id)
    const addQuery = await db
      .collection("users")
      .doc(query.docs[0].id)
      .collection("watchlist")
      .add({
        title: id,
        ticker: ticker,
      });
  };

  function clickBuyHandler() {
    console.log(ticker);
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
  }

  const clickSellHandler = () => {
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${id}&token=c5saqfaad3ia8bfblt0g`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res.c - buyPrice);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h2>your expected id : {id}</h2>
      <button onClick={addWatchlistHandler}>add to watchlist</button>
      <StockChart id={id} />
      <button
        onClick={() => {
          clickBuyHandler();
          openNewUserModal();
        }}
      >
        Buy
      </button>
      <button onClick={clickSellHandler}>Sell</button>
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
          <AddUserTitle>Confirmation to Buy</AddUserTitle>
          <UserInputDiv>
            <AddUserLabel>Shares to buy</AddUserLabel>
            <UserInput
              value={numberOfShares}
              onChange={(e) => {
                setNumberOfShares(e.target.value);
              }}
            />
          </UserInputDiv>
          <UserInputDiv>
            <p>
              Do you wish to buy shares of {id} at {buyPrice}
            </p>
          </UserInputDiv>
        </AddUserDiv>
      </BuySellModal>
    </div>
  );
}

export default Details;
