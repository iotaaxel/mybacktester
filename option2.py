from flask import Flask, request, jsonify
import pandas as pd
import yfinance as yf

app = Flask(__name__)

@app.route('/backtest', methods=['POST'])
def backtest():
    data = request.json
    strategy = data['strategy']
    portfolio = data['portfolio']
    start_date = data['start_date']
    end_date = data['end_date']

    # Load historical data for the portfolio
    portfolio_data = yf.download(portfolio, start=start_date, end=end_date)['Adj Close']

    # Apply the strategy to the portfolio data
    if strategy == 'moving_average':
        signals = pd.DataFrame(index=portfolio_data.index)
        signals['signal'] = 0.0
        signals['signal'][10:] = np.where(portfolio_data[10:] > portfolio_data[:-10].rolling(window=10).mean(), 1.0, 0.0)
        signals['positions'] = signals['signal'].diff()
    elif strategy == 'mean_reversion':
        signals = pd.DataFrame(index=portfolio_data.index)
        signals['signal'] = 0.0
        signals['signal'][10:] = np.where(portfolio_data[10:] < portfolio_data[:-10].rolling(window=10).mean(), -1.0, 0.0)
        signals['positions'] = signals['signal'].diff()

    # Calculate the returns of the strategy
    portfolio_returns = portfolio_data.pct_change()
    strategy_returns = portfolio_returns * signals['positions'].shift(1)

    # Calculate the cumulative returns of the strategy
    cumulative_returns = (1 + strategy_returns).cumprod()

    # Return the results
    return jsonify({'cumulative_returns': cumulative_returns.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
