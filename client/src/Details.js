import React, { useState, useContext, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "./axios";
import { TickerContext } from "./App";
import {db} from "./firebase"
import { UserContext } from "./App";
import StockChart from "./StockChart";

const stocks = require('stock-ticker-symbol');

function Details() {

    const {ticker, setTicker} = useContext(TickerContext);
    const {email, setEmail} = useContext(UserContext);
    const [runwatchlist, setRunwatchlist] = useState(false);
 


    const {id} = useParams();

    useEffect(() => {
      console.log(email);
      setTicker(stocks.searchName(id)[0].ticker)
    
    }, [])

    const addWatchlistHandler = async() => {
      const query = await db.collection('users').where('email', '==', email).get();
     // console.log("user id" + query.docs[0].id)
      const addQuery = await db.collection('users').doc(query.docs[0].id).collection("watchlist").add({
        title : id,
        ticker : ticker
      })
  
      
    };
    
    return (
        <div>
           <h2>your expected id : {id}</h2> 
           
           <button  onClick={addWatchlistHandler}>add to watchlist</button>
           <StockChart id={id}/>
        </div>
    )
}

export default Details;