// Variables needed to access different html elements, along with the parse to retrieve the array from local storage or to pull an empty array if nothing available
var cityInputEl = document.getElementById("city-input");
var searchButtonEl = document.getElementById("search-btn");
var cardBlockEl = document.getElementById("card-blocks");
var todayListEl = document.getElementById("one-day-forecast");
var buttonList = document.getElementById("storage-buttons");
var cityArray = JSON.parse(localStorage.getItem("cities")) || [];

// function that runs on "search" that creates the variable run through weatherFetch so that it can be assigned to input field or to button value
function onClick(event) {
    event.preventDefault();
    var cityInputVal = cityInputEl.value;
    weatherFetch(cityInputVal);
}

// function to run the weatherFetch function with the button value if button is clicked instead of search input
function buttonCall(event) {
    event.preventDefault();
    var search = event.target.innerText;
    weatherFetch(search);
}

// first adds the input to the cityArray in local storage, then runs the fetch call with the cityInputVal (city name from input field or button) taking the place of the city name in the URL. From there takes in the latitude and longitude for that city, as well as the city name since this is not included in the next batch of info, and then runs another fetch using that lat and lon in order to fetch the onecall api which includes the UVI
function weatherFetch(cityInputVal){

    cityArray.push(cityInputVal);
    localStorage.setItem("cities", JSON.stringify(cityArray));
    createButton(cityInputVal);
    
    var citySearchUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInputVal + "&appid=427c72356bf2f2c7899a5613b020d43f";

    fetch(citySearchUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var lat = data.city.coord.lat;
        var lon = data.city.coord.lon;
        var cityEl = document.getElementById("city-header");

        cityEl.textContent = data.city.name;

        var oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=427c72356bf2f2c7899a5613b020d43f"

        fetch(oneCallUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            createTodayForecast(data);
        });
    })
}

// Today's forecast in the jumbotron is filled out with data pulled from the api call, with a list being created for some values, and the UVI is colored according to severity. then a loop is run to create the 5-day cards
function createTodayForecast(data) {
    var headerDateEl = document.getElementById("date-header");
    var headerIconEl = document.getElementById("icon-header");
    var dataDate = data.daily[0].dt;
    var todayIcon = data.daily[0].weather[0].icon;
    var headerImg = "https://openweathermap.org/img/w/" + todayIcon + ".png";
    
    todayListEl.innerHTML = "";

    headerDateEl.textContent = moment.unix(dataDate).format("l");
    headerIconEl.setAttribute("src", headerImg);

    var todayTemp = document.createElement('li');
    todayTemp.textContent =  "Temp: " + data.daily[0].temp.max + "°";

    var todayWind = document.createElement('li');
    todayWind.textContent = "Wind: " + data.daily[0].wind_speed + "mph";

    var todayHumidity = document.createElement('li');
    todayHumidity.textContent = "Humidity: " + data.daily[0].humidity + "%";

    var todayUvi = document.createElement('li');
    todayUvi.textContent = "UVI: " + data.current.uvi;
    if (data.current.uvi <= 4) {
        todayUvi.setAttribute("class", "uvi-low")
    } else if (data.current.uvi <= 8) {
        todayUvi.setAttribute("class", "uvi-mid")
    } else {
        todayUvi.setAttribute("class", "uvi-high")
    }
    
    todayListEl.append(todayTemp, todayWind, todayHumidity, todayUvi)

    cardBlockEl.innerHTML = "";

    for(var i=1; i < 6; i++) {
        fiveDay(data.daily[i]);
    }
}

// loop runs through this function to create all the 5 day cards with data from the api call using the correct styling classes 
function fiveDay(daily) {
    var dateUnix = daily.dt
    var dailyIcon = daily.weather[0].icon;
    var dailyImg = "https://openweathermap.org/img/w/" + dailyIcon + ".png";

    var resultCol = document.createElement('div');
    resultCol.classList.add('col-2');

    var resultCard = document.createElement('div');
    resultCard.classList.add('card');
    resultCol.append(resultCard)

    var resultCardLook = document.createElement('div');
    resultCardLook.classList.add("card-body", "bg-dark", "text-white")
    resultCard.append(resultCardLook);

    var resultHead = document.createElement('h6');
    resultHead.classList.add('card-title')
    resultHead.textContent = moment.unix(dateUnix).format("l");
    resultCardLook.append(resultHead);
    
    var resultUl = document.createElement('ul');
    resultUl.classList.add('card-text');
    resultHead.append(resultUl);

    var resultIcon = document.createElement("img");
    resultIcon.setAttribute("src", dailyImg);

    var tempLi = document.createElement('li');
    tempLi.textContent = "Temp: " + daily.temp.max + "°";

    var windLi = document.createElement('li');
    windLi.textContent = "Wind: " + daily.wind_speed + "mph";

    var humidLi = document.createElement('li');
    humidLi.textContent = "Humidity: " + daily.humidity + "%";

    resultUl.append(resultIcon, tempLi, windLi, humidLi)

    cardBlockEl.append(resultCol);
}

// on page load, for-loop is run that triggers the "create button" function each time it runs through it in order to generate buttons on the side with previously entered cities stored in the local storage array
for (var i=0; i < cityArray.length; i++) {
    createButton(cityArray[i]);
}
function createButton(cityName) {
    var button = document.createElement('button');
    button.classList.add("storagebtn", "btn", "btn-secondary", "col-md-12", "m-2");
    button.setAttribute("data-city", cityName);
    button.textContent = cityName;
    buttonList.append(button);
}

// click events corresponding to search button and local storage buttons 
searchButtonEl.addEventListener('click', onClick);
buttonList.addEventListener('click', buttonCall);