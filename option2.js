import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Backtester() {
  const [strategy, setStrategy] = useState('moving_average');
  const [portfolio, setPortfolio] = useState('AAPL');
  const [start_date, setStartDate] = useState('2020-01-01');
  const [end_date, setEndDate] = useState('2020-12-31');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post('http://localhost:5000/backtest', {
        strategy,
        portfolio,
        start_date,
        end_date,
      });
      setResults(response.data.cumulative_returns);
    };
    fetchData();
  }, [strategy, portfolio, start_date, end_date]);

  return (
    <div>
      <h1>Backtester</h1>
      <form>
        <label>
          Strategy:
          <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
            <option value="moving_average">Moving Average</option>
            <option value="mean_reversion">Mean Reversion</option>
          </select>
        </label>
        <br />
        <label>
          Portfolio:
          <input type="text" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
        </label>
        <br />
        <label>
          Start Date:
          <input type="date" value={start_date} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <br />
        <label>
          End Date:
          <input type="date" value={end_date} onChange={(e) => setEndDate(e.target.value)} />
        </label>
      </form>
      <h2>Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default Backtester;
