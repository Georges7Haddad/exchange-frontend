import "./App.css";
import UserCredentialsDialog from "./UserCredentialsDialog/UserCredentialsDialog";
import { useState, useCallback, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { DataGrid } from "@material-ui/data-grid";
import { getUserToken, saveUserToken, removeUserToken } from "./localStorage";

var SERVER_URL = "http://127.0.0.1:5000";
function App() {
  let [buyUsdRate, setBuyUsdRate] = useState(null);
  let [sellUsdRate, setSellUsdRate] = useState(null);
  let [lbpInput, setLbpInput] = useState("");
  let [usdInput, setUsdInput] = useState("");
  let [transactionType, setTransactionType] = useState("usd-to-lbp");
  let [userToken, setUserToken] = useState(getUserToken());
  let [calculatorTransactionType, setCalculatorTransactionType] = useState(
    "usd-to-lbp"
  );
  let [calculatorInput, setCalculatorInput] = useState("");
  let [calculatorResult, setCalculatorResult] = useState("");
  let [userTransactions, setUserTransactions] = useState([]);
  const States = {
    PENDING: "PENDING",
    USER_CREATION: "USER_CREATION",
    USER_LOG_IN: "USER_LOG_IN",
    USER_AUTHENTICATED: "USER_AUTHENTICATED",
  };
  let [authState, setAuthState] = useState(States.PENDING);

  function fetchRates() {
    fetch(`${SERVER_URL}/exchangeRate`)
      .then((response) => response.json())
      .then((data) => {
        setBuyUsdRate(data["lbp_to_usd"]);
        setSellUsdRate(data["usd_to_lbp"]);
      });
  }
  useEffect(fetchRates, []);

  const fetchUserTransactions = useCallback(() => {
    fetch(`${SERVER_URL}/transaction`, {
      headers: {
        Authorization: `${userToken}`,
      },
    })
      .then((response) => response.json())
      .then((transactions) => setUserTransactions(transactions));
  }, [userToken]);
  console.log(userTransactions);
  useEffect(() => {
    if (userToken) {
      fetchUserTransactions();
    }
  }, [fetchUserTransactions, userToken]);

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
        Authorization: userToken,
      },
      body: JSON.stringify(data),
    }).then(fetchRates);
  }

  function login(username, password) {
    return fetch(`${SERVER_URL}/authentication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        setAuthState(States.USER_AUTHENTICATED);
        setUserToken(body.token);
        saveUserToken(body.token);
      });
  }

  function createUser(username, password) {
    return fetch(`${SERVER_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    }).then((response) => login(username, password));
  }

  function logout() {
    setUserToken(null);
    removeUserToken();
  }
  function calculate(input = null) {
    let amount = input !== null ? input : calculatorInput;
    let result =
      calculatorTransactionType === "usd-to-lbp"
        ? parseFloat(sellUsdRate) * amount
        : parseFloat(buyUsdRate) * amount;
    setCalculatorResult(result);
  }

  return (
    <div>
      <div>
        <AppBar position="static">
          <Toolbar classes={{ root: "nav" }}>
            <Typography variant="h5">Lebanese Rate Exchange</Typography>
            {userToken !== null ? (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            ) : (
              <div>
                <Button
                  color="inherit"
                  onClick={() => setAuthState(States.USER_CREATION)}
                >
                  Register
                </Button>
                <Button
                  color="inherit"
                  onClick={() => setAuthState(States.USER_LOG_IN)}
                >
                  Login
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <div className="wrapper">
        <Snackbar
          elevation={6}
          variant="filled"
          open={authState === States.USER_AUTHENTICATED}
          autoHideDuration={2000}
          onClose={() => setAuthState(States.PENDING)}
        >
          <Alert severity="success">Success</Alert>
        </Snackbar>
        <UserCredentialsDialog
          open={authState === States.USER_CREATION ? true : false}
          onSubmit={createUser}
          onClose={() => setAuthState(States.PENDING)}
          title="Register"
          submitText="Sign Up"
        />
        <UserCredentialsDialog
          open={authState === States.USER_LOG_IN ? true : false}
          onSubmit={login}
          onClose={() => setAuthState(States.PENDING)}
          title="Login"
          submitText="Login"
        />
        <Typography variant="h5">Today's Exchange Rate</Typography>
        <p>LBP to USD Exchange Rate</p>
        <Typography variant="h6">
          Buy USD:{" "}
          <span id="buy-usd-rate">{buyUsdRate || "Not Available Yet"}</span>
        </Typography>
        <Typography variant="h6">
          Sell USD:{" "}
          <span id="sell-usd-rate">{sellUsdRate || "Not Available Yet"}</span>
        </Typography>
        <hr />
        <Typography variant="h5">Calculator</Typography>
        <form name="transaction-entry">
          <div className="amount-input">
            <TextField
              id="calculator-amount"
              type="number"
              label="Amount"
              variant="outlined"
              value={calculatorInput}
              onChange={(e) => {
                setCalculatorInput(e.target.value);
                calculate(e.target.value);
              }}
            />
            <Box mr={1} />
            <Select
              id="transaction-type"
              value={calculatorTransactionType}
              onChange={(e) => setCalculatorTransactionType(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
              <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
            </Select>
            <Box mr={1} />
            <TextField
              variant="outlined"
              disabled
              id="usd-amount"
              type="number"
              value={calculatorResult}
            />
          </div>
        </form>
      </div>
      <div className="wrapper">
        <Typography variant="h5">Record a recent transaction</Typography>
        <form name="transaction-entry">
          <div className="amount-input">
            <TextField
              id="lbp-amount"
              type="number"
              label="LBP Amount"
              variant="outlined"
              value={lbpInput}
              onChange={(e) => setLbpInput(e.target.value)}
            />
            <Box mr={1} />
            <TextField
              id="usd-amount"
              type="number"
              label="USD Amount"
              variant="outlined"
              value={usdInput}
              onChange={(e) => setUsdInput(e.target.value)}
            />
            <Box mr={1} />
            <Select
              id="transaction-type"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              variant="outlined"
            >
              <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
              <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
            </Select>
            <Box mr={1} />
            <Button id="add-button" onClick={addItem} className="button">
              Add
            </Button>
          </div>
        </form>
      </div>
      {userToken && (
        <div className="wrapper">
          <Typography variant="h5">Your Transactions</Typography>
          <DataGrid
            columns={[
              { field: "added_date", width: 120 },
              { field: "id", width: 70 },
              { field: "lbp_amount", width: 140 },
              { field: "usd_amount", width: 140 },
              { field: "usd_to_lbp", width: 140 },
              { field: "user_id", width: 100 },
            ]}
            rows={userTransactions}
            autoHeight
          />{" "}
        </div>
      )}
    </div>
  );
}

export default App;
