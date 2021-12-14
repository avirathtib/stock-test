import React, { useState, useContext } from "react";
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from 'react-router-dom';
import { TickerContext } from "./App";
const stockSymbols = require("stock-ticker-symbol");


function SearchBar({ placeholder }) {
  const {ticker, setTicker} = useContext(TickerContext)
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");


  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
   

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(stockSymbols.search(searchWord));
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {filteredData.length === 0 ? (
            <SearchIcon />
          ) : (
            <CloseIcon id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>
      {filteredData.length != 0 && (
        <div className="dataResult">
          {filteredData.map((value, key) => {
            console.log(value);
            return (
              <a 
               className="dataItem"  target="_blank">
                <Link to={`/stocks/${value.name}` }>{value.name}</Link>
              </a>

            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;