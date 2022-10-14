var cityInput = document.getElementById("citySearch");
var searchButton = document.getElementById("searchBtn");
var history = document.getElementById("searchHistory");
var searchSubmit = document.getElementById("searchSubmit");
var currentWeather = document.getElementById("today");
var fiveDayForecast = document.getElementById("forecastCard");

var APIkey = "a387c7beacd4ee8b8b0a6daeb877befb";
var cities = [];

var loadCities = function () {
    var citiesLoaded = localStorage.getItem("cities")
    if (!citiesLoaded) {
        return false;
    }
    citiesLoaded = JSON.parse(citiesLoaded);

    for (var i = 0; i < citiesLoaded.length; i++) {
        displaySearchedCities(citiesLoaded[i])
        cities.push(citiesLoaded[i])
    }
}
// Function to display the CURRENT weather data fetched from OpenWeather api.
function renderCurrentWeather(city, data) {
    console.log(city, data);
    // Store response data from our fetch request in variables
    // temperature, wind speed, etc.
    var currentTemp = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var iconCurrent = data.weather[0].icon;

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
    currentWeather.appendChild(divCityHeader)

    var currentDiv = document.createElement("div")
    var currentTempEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    // append those elements somewhere

    currentDiv.appendChild(currentTempEl);
    currentDiv.appendChild(humidityEl);
    currentDiv.appendChild(windSpeedEl);

    currentWeather.appendChild(currentDiv);
    // give them their appropriate content
    currentTempEl.textContent = "Temperature: " + currentTemp + "°F";
    humidityEl.textContent = "Humidity: " + humidity + "%";
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + " MPH";


};
// Function to display 5 day forecast.
function renderForecast(data) {
    // set up elements for this section
    //console.log(data);
    fiveDayForecast.textContent = "";
    var forecastHeader = document.getElementById("fiveDay");
    forecastHeader.textContent = "Five Day Forecast:"

    for (var i = 1; i < 6; i++) {
        var tempForecast = data.list[i].main.temp;
        var humidityForecast = data.list[i].main.humidity;
        var windForecast = data.list[i].wind.speed;
        var iconForecast = data.list[i].weather[0].icon;

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
function getFiveDayForecast(lat, lon) {
    var getUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey;
    fetch(getUrl)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            renderForecast(data);
        })
}
// gets weather based off of coordinates
function getWeather(city, lat, lon) {
    console.log(city, lat, lon);
    // fetch for weather with weather API 
    // api url
    var getURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey;
    // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(city, data)
    fetch(getURL)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            getFiveDayForecast(lat, lon);
            renderCurrentWeather(city, data);
        })
}
function getCityData(city) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then((data) => {
            //var city = data[0].name;
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log(data);
            getWeather(city, lat, lon);

        });
}

// Adds getCityData function to retrieve the latitude and longitude coordinates. 
searchSubmit.addEventListener("submit", function (e) {
    e.preventDefault();
    var city = cityInput.value.trim();
    console.log(city);
    getCityData(city);

})
