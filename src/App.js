import "./App.css";

function App() {
  return (
    <div>
      <div>
        <h1 className="header">Lebanse Pound Exchange Rate Tracker</h1>
      </div>
      <div className="wrapper">
        <h2>Today's Exchange Rate</h2>
        <p>LBP to USD Exchange Rate</p>
        <h3>
          Buy USD: <span id="buy-usd-rate">Not available yet</span>
        </h3>
        <h3>
          Sell USD: <span id="sell-usd-rate">Not available yet</span>
        </h3>
        <hr />
        <h2>Record a recent transaction</h2>
        <form name="transaction-entry">
          <div className="amount-input">
            <label htmlFor="lbp-amount">LBP Amount</label>
            <input id="lbp-amount" type="number" />
            <label htmlFor="usd-amount">USD Amount</label>
            <input id="usd-amount" type="number" />
            <select id="transaction-type">
              <option value="usd-to-lbp">USD to LBP</option>
              <option value="lbp-to-usd">LBP to USD</option>
            </select>
            <button id="add-button" className="button" type="button">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
