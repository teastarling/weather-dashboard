var cityInputEl = document.getElementById("city-input");
var searchButtonEl = document.getElementById("search-btn")
var urlNewYork = "https://api.openweathermap.org/data/2.5/forecast?q=New York&appid=427c72356bf2f2c7899a5613b020d43f";
var cityArray = [];

function fiveDayUrl(event) {
    event.preventDefault();

    var cityInputVal = cityInputEl.value
    
    localStorage.setItem(cityInputVal, cityInputVal);
    
    var citySearchUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInputVal + "&appid=427c72356bf2f2c7899a5613b020d43f";

    fetch(citySearchUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    });


}

searchButtonEl.addEventListener('click', fiveDayUrl);