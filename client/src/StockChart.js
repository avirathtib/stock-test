import React, {useState, useEffect, useContext} from 'react'
import Plot from 'react-plotly.js';
import { TickerContext } from './App';
const stocks = require('stock-ticker-symbol');

function StockChart(props) {
    const[stockChartXValues, setStockChartXValues] = useState([]);
    const[stockChartYValues, setStockChartYValues] = useState([]);
    const {ticker, setTicker} = useContext(TickerContext);

    useEffect(() => {
        fetchStock()
    }, [])

    const fetchStock = () => {
        console.log(ticker + "stockchart")
        const API_KEY = 'HGJWFG4N8AQ66ICD'
        let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stocks.searchName(props.id)[0].ticker}&outputsize=compact&apikey=${API_KEY}`;
        let stockChartXValuesFunction = [];
        let stockChartYValuesFunction = [];
        fetch(API_Call)
      .then(
        function(response) {
          return response.json();
        }
      )
      .then(
        function(data) {
          console.log(data);

          for (var key in data['Time Series (Daily)']) {
            stockChartXValuesFunction.push(key);
            stockChartYValuesFunction.push(data['Time Series (Daily)'][key]['1. open']);
          }

          // console.log(stockChartXValuesFunction);
          setStockChartXValues(stockChartXValuesFunction);
          setStockChartYValues(stockChartYValuesFunction);
        }
      )

    }

    return (
        <div>
            <h1>Stock market</h1>
            <Plot
            data={[{
                x: stockChartXValues,
                y: stockChartYValues,
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'red'},
            }]}
            layout={{width:720, height:480, title: 'A Fancy Plot'}}/>
            
        </div>
    )
}

export default StockChart
