var SERVER_URL = "http://127.0.0.1:5000";

var addButton = document.getElementById("add-button");
addButton.addEventListener("click", addItem);

var transactionType = document.getElementById("transaction-type");
var inputUsdAmount = document.getElementById("usd-amount");
var inputLbpAmount = document.getElementById("lbp-amount");
var buyUsdRateSpan = document.getElementById("buy-usd-rate");
var sellUsdRateSpan = document.getElementById("sell-usd-rate");

function addItem() {
  let data = {
    usd_amount: inputUsdAmount.value,
    lbp_amount: inputLbpAmount.value,
    usd_to_lbp: transactionType.value === "usd-to-lbp" ? true : false,
  };
  fetch(`${SERVER_URL}/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(fetchRates);

  inputLbpAmount.value = null;
  inputUsdAmount.value = null;
}

function fetchRates() {
  fetch(`${SERVER_URL}/exchangeRate`)
    .then((response) => response.json())
    .then((data) => {
      buyUsdRateSpan.innerHTML = data["lbp_to_usd"];
      sellUsdRateSpan.innerHTML = data["usd_to_lbp"];
    });
}
fetchRates();
