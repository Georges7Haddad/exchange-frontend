import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

var SERVER_URL = "http://127.0.0.1:5000";
function App() {
  let [buyUsdRate, setBuyUsdRate] = useState(null);
  let [sellUsdRate, setSellUsdRate] = useState(null);
  let [lbpInput, setLbpInput] = useState("");
  let [usdInput, setUsdInput] = useState("");
  let [transactionType, setTransactionType] = useState("usd-to-lbp");

  function fetchRates() {
    fetch(`${SERVER_URL}/exchangeRate`)
      .then((response) => response.json())
      .then((data) => {
        setBuyUsdRate(data["lbp_to_usd"]);
        setSellUsdRate(data["usd_to_lbp"]);
      });
  }
  useEffect(fetchRates, []);

  function addItem() {
    let data = {
      usd_amount: usdInput,
      lbp_amount: lbpInput,
      usd_to_lbp: transactionType === "usd-to-lbp" ? true : false,
    };
    fetch(`${SERVER_URL}/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(fetchRates);
  }

  return (
    <div>
      <div>
        <h1 className="header">Lebanse Pound Exchange Rate Tracker</h1>
      </div>
      <div className="wrapper">
        <h2>Today's Exchange Rate</h2>
        <p>LBP to USD Exchange Rate</p>
        <h3>
          Buy USD:{" "}
          <span id="buy-usd-rate">{buyUsdRate || "Not Available Yet"}</span>
        </h3>
        <h3>
          Sell USD:{" "}
          <span id="sell-usd-rate">{sellUsdRate || "Not Available Yet"}</span>
        </h3>
        <hr />
        <h2>Record a recent transaction</h2>
        <form name="transaction-entry">
          <div className="amount-input">
            <label htmlFor="lbp-amount">LBP Amount</label>
            <input
              id="lbp-amount"
              type="number"
              value={lbpInput}
              onChange={(e) => setLbpInput(e.target.value)}
            />
            <label htmlFor="usd-amount">USD Amount</label>
            <input
              id="usd-amount"
              type="number"
              value={usdInput}
              onChange={(e) => setUsdInput(e.target.value)}
            />
            <select
              id="transaction-type"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <option value="usd-to-lbp">USD to LBP</option>
              <option value="lbp-to-usd">LBP to USD</option>
            </select>
            <button
              id="add-button"
              className="button"
              type="button"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
