var addButton = document.getElementById("add-button");
addButton.addEventListener("click", addItem);
var transactionType = document.getElementById("transaction-type");
var inputUsdAmount = document.getElementById("usd-amount");
var inputLbpAmount = document.getElementById("lbp-amount");
var buyUsdRateSpan = document.getElementById("buy-usd-rate");
var sellUsdRateSpan = document.getElementById("sell-usd-rate");

var sellUsdTransactions = [];
var buyUsdTransactions = [];

function addItem() {
  let rate = inputLbpAmount.value / inputUsdAmount.value;
  if (transactionType.value === "usd-to-lbp") {
    sellUsdTransactions.push(rate);
  } else if (transactionType.value === "lbp-to-usd") {
    buyUsdTransactions.push(rate);
  }
  inputLbpAmount.value = null;
  inputUsdAmount.value = null;
  updateRates();
}

function updateRates() {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  buyUsdRateSpan.innerHTML =
    buyUsdTransactions.reduce(reducer, 0) / buyUsdTransactions.length ||
    "Not available yet";
  sellUsdRateSpan.innerHTML =
    sellUsdTransactions.reduce(reducer, 0) / sellUsdTransactions.length ||
    "Not available yet";
}
