import React, { useState } from 'react';
import axios from 'axios';

function Backtester() {
  const [strategy, setStrategy] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState('');

  const handleStrategyChange = (event) => {
    setStrategy(event.target.value);
  };

  const handlePortfolioChange = (event) => {
    setPortfolio(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleBacktest = () => {
    axios.post('http://localhost:5000/backtest', {
      strategy: strategy,
      portfolio: portfolio,
      start_date: startDate,
      end_date: endDate,
    })
    .then((response) => {
      setResult(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <div>
      <h1>Backtester</h1>
      <form>
        <label>Strategy:</label>
        <select value={strategy} onChange={handleStrategyChange}>
          <option value="">Select a strategy</option>
          <option value="mean_reversion">Mean Reversion</option>
          <option value="moving_average_crossover">Moving Average Crossover</option>
        </select>
        <br />
        <label>Portfolio:</label>
        <select value={portfolio} onChange={handlePortfolioChange}>
          <option value="">Select a portfolio</option>
          <option value="sp500">S&P 500</option>
          <option value="dow_jones">Dow Jones</option>
        </select>
        <br />
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={handleStartDateChange} />
        <br />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={handleEndDateChange} />
        <br />
        <button onClick={handleBacktest}>Backtest</button>
      </form>
      <h2>Result:</h2>
      <p>{result}</p>
    </div>
  );
}

export default Backtester;
