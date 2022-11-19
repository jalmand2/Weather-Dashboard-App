var cityInput = document.getElementById("citySearch");
var searchButton = document.getElementById("searchBtn");
var savedSearch = document.getElementById("searchHistory");
var searchSubmit = document.getElementById("searchSubmit");
var currentWeather = document.getElementById("today");
var fiveDayForecast = document.getElementById("forecastCard");

var APIkey = "a387c7beacd4ee8b8b0a6daeb877befb";
var search = '';
var city = '';
var lat;
var lon;

// Pulls searches from local storage and displays them on page
function initSearchHistory() {
    savedSearch.innerHTML = "";
    for (var i = 0; i < localStorage.length; i++) {
      city = localStorage.getItem(localStorage.key(i));
      var savedCityButton = document.createElement("button");
      savedCityButton.setAttribute("class", "btn btn-dark col-md-11 m-1");
      savedCityButton.setAttribute('id', city);
      savedCityButton.textContent = city;
      savedSearch.appendChild(savedCityButton);
      document.getElementById(city).addEventListener('click', handleSearchHistoryClick);
    }
  }
  
  // Adds searched city to local storage. Calls function to add button to page
  function appendToHistory(search) {
    localStorage.setItem(search, search);
    initSearchHistory();
  }

// Function to display the CURRENT weather data fetched from OpenWeather api.
function renderCurrentWeather(city, data) {
    console.log(city, data);
    // Store response data from our fetch request in variables
    // temperature, wind speed, etc.
    var currentTemp = data.list[0].main.temp;
    var humidity = data.list[0].main.humidity;
    var windSpeed = data.list[0].wind.speed;
    var iconCurrent = data.list[0].weather[0].icon;

    // document.create the elements you'll want to put this information in  
    currentWeather.textContent = ""
    currentWeather.setAttribute("class", "m-3 border col-10 text-center")
    var divCityHeader = document.createElement("div")
    var headerCityDate = document.createElement("h5");
    var currentDate = moment().format("MM/DD/YYYY");
    var imageIcon = document.createElement("img");
    imageIcon.setAttribute("src", "")
    imageIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + iconCurrent + "@2x.png")
    headerCityDate.textContent = city + "(" + currentDate + ")";


    divCityHeader.appendChild(headerCityDate)
    divCityHeader.appendChild(imageIcon)
    currentWeather.appendChild(divCityHeader) //was divCityHeader

    var currentDiv = document.createElement("div")
    var currentTempEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    // append those elements somewhere

    currentDiv.appendChild(currentTempEl);
    currentDiv.appendChild(humidityEl);
    currentDiv.appendChild(windSpeedEl);

    currentWeather.appendChild(currentDiv); // was currentDiv
    // give them their appropriate content
    currentTempEl.textContent = "Temperature: " + currentTemp + "°F";
    humidityEl.textContent = "Humidity: " + humidity + "%";
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + " MPH";

}
// Function to display 5 day forecast.
function renderForecast(data) {
    // set up elements for this section
    //console.log(data);
    fiveDayForecast.textContent = "";
    var forecastHeader = document.getElementById("fiveDay");
    forecastHeader.textContent = "Five Day Forecast:"

    for (var i = 1; i < 6; i++) {
        var tempForecast = data.list[1].main.temp;
        var humidityForecast = data.list[1].main.humidity;
        var windForecast = data.list[1].wind.speed;
        var iconForecast = data.list[1].weather[0].icon;

        var cardEl = document.createElement("div");
        cardEl.setAttribute("class", "card col-xl-2 col-md-5 col-sm-10 mx-2 my-1 bg-primary text-white text-left h-50");

        var cardBodyEl = document.createElement("div");
        cardBodyEl.setAttribute("class", "card-body");

        var cardDateEl = document.createElement("h6");
        cardDateEl.textContent = moment().add(i, "days").format("MM/DD/YYYY");

        var cardIconEl = document.createElement("img");
        cardIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + iconForecast + "@2x.png");

        var cardTempEl = document.createElement("p");
        cardTempEl.setAttribute("class", "card-text");
        cardTempEl.textContent = "Temp: " + tempForecast + "°F";

        var cardWindEl = document.createElement("p");
        cardWindEl.setAttribute("class", "card-text");
        cardWindEl.textContent = "Wind: " + windForecast + "MPH";

        var cardHumidEl = document.createElement("p");
        cardHumidEl.setAttribute("class", "card-text");
        cardHumidEl.textContent = "Humidity: " + humidityForecast + "%";

        // append
        cardBodyEl.appendChild(cardDateEl)
        cardBodyEl.appendChild(cardIconEl)
        cardBodyEl.appendChild(cardTempEl)
        cardBodyEl.appendChild(cardHumidEl)
        cardBodyEl.appendChild(cardWindEl)

        cardEl.appendChild(cardBodyEl);
        fiveDayForecast.appendChild(cardEl);

        //cityFormEl.reset()
    }
}

function renderWeatherInfo(city, data) {
    renderCurrentWeather(city, data);
    renderForecast(data);
}

// gets weather based off of coordinates

function getWeather(city, lat, lon) {
    // console.log(city, lat, lon);
    // fetch for weather with weather API 
    // api url
    var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey;
    // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
    fetch(weatherURL)
        .then(function(response) {
            if (response.ok) {
                response.json()
                .then(function (data) {
                    renderWeatherInfo(city, data);
                })
            } else {
                return;
            }
        })
}

function fetchCoords(search) {
    var city = search;
    var getUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey;
    fetch(getUrl)
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then(function (data) {
                        // Returns nothing if the data has no information, ex: city does not exist in api
                        if (data.length === 0) {
                            alert('Something went wrong, please try again!');
                            return;
                        }
                        lat = data[0].lat;
                        lon = data[0].lon;
                        search = data[0].name;
                        // console.log(data);
                        appendToHistory(search);
                        getWeather(city, lat, lon);
                    })
            } else {
                return;
            }
        })
}

function handleSearchFormSubmit(e) {
    if (!cityInput.value) {
        return;
    }
    e.preventDefault();

    search = cityInput.value.trim();
    fetchCoords(search);
    cityInput.value = '';
}
function handleSearchHistoryClick(e) {
    search = e.target.textContent;
    fetchCoords(search);
}

initSearchHistory();

// Adds getCityData function to retrieve the latitude and longitude coordinates. 
searchSubmit.addEventListener("submit", handleSearchFormSubmit);

