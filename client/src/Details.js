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
import firebase from "firebase";
import UserInput from "./components/UserInput";
import { Button } from "react-bootstrap";

import { send } from "emailjs-com";

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

const AddUserPara = styled.h3`
  width: 100%;
  font-size: 1.5em;
  margin: 0px;
  color: #080f14;
  text-align: left;
`;

const AddUserLabel = styled.p`
  margin-bottom: 2px;
`;

function Details() {
  const { ticker, setTicker } = useContext(TickerContext);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [shareOwned, setShareOwned] = useState(false);
  const [numberOfSharesOwned, setNumberOfSharesOwned] = useState(0);
  const { email, setEmail } = useContext(UserContext);
  const [numberOfShares, setNumberOfShares] = useState(0);
  const [numberOfSellShares, setNumberOfSellShares] = useState(0);
  const [showSellError, setShowSellError] = useState(false);
  const [buyPrice, setBuyPrice] = useState(0);
  const [SellPrice, setSellPrice] = useState(0);
  const [latestPrice, setLatestPrice] = useState(0);
  const [openbuy, setOpenBuy] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [toSend, setToSend] = useState({
    playerName: "defaultName",
    numberOfShares: 0,
    ticker: "",
    player_email: "",
  });

  const url =
    "https://finnhub.io/api/v1/quote?symbol=AAPL&token=c5saqfaad3ia8bfblt0g";

  const { id } = useParams();

  useEffect(() => {
    console.log(email);
    setTicker(stocks.searchName(id)[0].ticker);
    checkOwnership();
    getUserByEmail(email);
    // everyBuyUpdate();
  }, []);

  function openNewUserModal() {
    setShowNewUserModal(true);
  }

  function closeNewUserModal() {
    setShowNewUserModal(false);
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
      console.log(data.name);
      setPlayerName(data.name);
      console.log(playerName);
    } else {
      console.log("Error");
    }
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
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5saqfaad3ia8bfblt0g`
    )
      .then((res) => res.json())
      .then((res) => {
        setBuyPrice(res.c);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const clickSellHandler = () => {
    fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c5saqfaad3ia8bfblt0g`
    )
      .then((res) => res.json())
      .then((res) => {
        setSellPrice(res.c);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addBuyHistoryHandler = async () => {
    console.log(playerName);
    console.log(numberOfShares);
    console.log(ticker);
    //#endregion
    // setToSend({ ...toSend, playerName: playerName });
    // setToSend({ ...toSend, numberOfShares: numberOfShares });
    // setToSend({ ...toSend, ticker: ticker });
    // setToSend({
    //   playerName: playerName,
    //   numberOfShares: numberOfShares,
    //   ticker: ticker,
    // });
    everyBuyUpdate();
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!shareOwned) {
      const addNewQuery = await db
        .collection("users")
        .doc(query.docs[0].id)
        .collection("buyhistory")
        .doc(ticker)
        .set({
          title: id,
          ticker: ticker,
          quantity: Number(numberOfShares),
          pricePerShare: buyPrice,
          totalPrice: numberOfShares * buyPrice,
          profit: 0,
        });
      setShareOwned(true);
    } else {
      const updateOldQuery = await db
        .collection("users")
        .doc(query.docs[0].id)
        .collection("buyhistory")
        .doc(ticker)
        .update({
          quantity: numberOfSharesOwned + Number(numberOfShares),
          pricePerShare:
            (latestPrice * numberOfSharesOwned +
              Number(numberOfShares) * buyPrice) /
            (numberOfSharesOwned + Number(numberOfShares)),
          totalPrice:
            latestPrice * numberOfSharesOwned + numberOfShares * buyPrice,
        });
    }

    console.log(toSend);

    send(
      "service_5xpu2bp",
      "template_jqlnb63",
      toSend,
      "user_nfA4g1TsEgaJMemoNN6zX"
    );
  };

  async function checkOwnership() {
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    const checkQuery = await db
      .collection("users")
      .doc(query.docs[0].id)
      .collection("buyhistory")
      .get()
      .then(function (querySnapshot) {
        console.log(query.docs[0].id);
        querySnapshot.forEach(function (doc) {
          if (doc.data().title == id) {
            setShareOwned(true);
          }
        });
      });
  }

  async function everyBuyUpdate() {
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    const checkQuery = await db
      .collection("users")
      .doc(query.docs[0].id)
      .collection("buyhistory")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().title == id) {
            setNumberOfSharesOwned(doc.data().quantity);
            console.log(numberOfSharesOwned);
            setLatestPrice(doc.data().pricePerShare);
            console.log(latestPrice);
          }
        });
      });
  }

  const addSellHistoryHandler = async () => {
    const query = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    const updateOldQuery = await db
      .collection("users")
      .doc(query.docs[0].id)
      .collection("buyhistory")
      .doc(ticker)
      .update({
        quantity: numberOfSharesOwned - Number(numberOfSellShares),
        totalPrice:
          latestPrice * (numberOfSharesOwned - Number(numberOfSellShares)),
        profit: numberOfSellShares * (SellPrice - latestPrice),
      });
  };

  return (
    <div>
      <h2>your expected id : {id}</h2>
      <button onClick={addWatchlistHandler}>add to watchlist</button>
      <StockChart id={id} />
      {console.log(shareOwned)}
      {shareOwned ? (
        <div>
          <button
            onClick={() => {
              setOpenBuy(true);
              clickBuyHandler();
              openNewUserModal();
            }}
          >
            Buy
          </button>
          <button
            onClick={() => {
              setOpenBuy(false);
              clickSellHandler();
              openNewUserModal();
              everyBuyUpdate();
            }}
          >
            Sell
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setOpenBuy(true);
            clickBuyHandler();
            openNewUserModal();
          }}
        >
          Buy
        </button>
      )}

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
        {openbuy ? (
          <AddUserDiv>
            <CloseButton onClick={() => closeNewUserModal()}>
              <CloseButtonImg src={x} />
            </CloseButton>
            <AddUserTitle>Confirmation to Buy</AddUserTitle>
            <UserInputDiv>
              <AddUserLabel>
                How many shares of {id} do you wish to buy at {buyPrice} each?
              </AddUserLabel>
              <UserInput
                value={numberOfShares}
                onChange={(e) => {
                  setNumberOfShares(e.target.value);
                  const tempObject = {
                    ...toSend,
                    playerName: playerName,
                    numberOfShares: e.target.value,
                    ticker: ticker,
                    player_email: email,
                  };
                  setToSend(tempObject);
                }}
              />
            </UserInputDiv>
            <UserInputDiv></UserInputDiv>
            <AddUserPara>Total Price : {numberOfShares * buyPrice}</AddUserPara>
            <Button onClick={addBuyHistoryHandler}>Confirm buy</Button>
          </AddUserDiv>
        ) : (
          <AddUserDiv>
            <CloseButton onClick={() => closeNewUserModal()}>
              <CloseButtonImg src={x} />
            </CloseButton>
            <AddUserTitle>Confirmation to Sell</AddUserTitle>
            <UserInputDiv>
              <AddUserLabel>
                How many shares of {id} do you wish to sell at {SellPrice} each?
              </AddUserLabel>
              <UserInput
                value={numberOfSellShares}
                onChange={(e) => {
                  if (e.target.value > numberOfSharesOwned) {
                    setShowSellError(true);
                    setNumberOfSellShares(e.target.value);
                  } else {
                    setShowSellError(false);
                    setNumberOfSellShares(e.target.value);
                  }
                }}
              />
              {showSellError ? <p>Exceeds number of shares owned</p> : <> </>}
            </UserInputDiv>
            <UserInputDiv></UserInputDiv>
            <AddUserPara>
              Total Price : {numberOfSellShares * SellPrice}
            </AddUserPara>
            <Button
              disabled={showSellError ? true : false}
              onClick={addSellHistoryHandler}
            >
              Confirm sell
            </Button>
          </AddUserDiv>
        )}
      </BuySellModal>
    </div>
  );
}

export default Details;
