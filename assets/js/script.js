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
                            alert('Unknown City. \nBe sure to only type the city name without the State.\n\nIf issue persists please try another city.');
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

