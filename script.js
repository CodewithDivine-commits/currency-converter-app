window.addEventListener("DOMContentLoaded", () => {
  const droplist = document.querySelectorAll(".drop-list select");
  const exchangeRateTxt= document.querySelector(".exchange-rate");
  const getButton = document.querySelector("button");
  const amountInput= document.querySelector(".amount input");

  const countryCodeMap = {
    USD: "US",
    INR: "IN",
    PKR: "PK",
    MAD: "MA",
    EUR:  "DE",
    GBP: "GB",

  };

  //function to update the flag images 
  function loadFlagCode(element) {
    const currencyCode = element.value;
    const flagId = element.getAttribute("data-flag");
    const imgTag = document.getElementById(flagId);
    const countryCode = countryCodeMap[currencyCode]  || "US";//fallback to US flag
    imgTag.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }

//set flag change listener for all selects
  droplist.forEach(select => {
    select.addEventListener("change", function () {
      loadFlagCode(this);
    });

    // set flag on load
    loadFlagCode(select);
  });

  // button to click to fetch exchange rate
  getButton.addEventListener("click", (e)=>{
    e.preventDefault();
    getExchangeRate();
  });

  //Function to fetch live example rate using Frankfurter API
  function getExchangeRate(){
    const amountVal= amountInput.value || 1;
    const fromCurrency = droplist[0].value;
    const toCurrency = droplist[1].value;


    if (fromCurrency === toCurrency){
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency} = ${amountVal} ${toCurrency}`;
        return;
    }

    const url = `https://api.frankfurter.app/latest?amount=${amountVal}&from=${fromCurrency}`;

    fetch(url)
    .then(res => res.json())
    .then(data => {
        const rate = data.rates[toCurrency];
        if (rate){
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency} = ${rate} ${toCurrency}`;
        }else{
            exchangeRateTxt.innerText = "Falied to fetch rate!";
        }
        
    })
    .catch((err) => {
        console.log(err);
        exchangeRateTxt.innerText = "Something went wrong!";

    });
  }
});
