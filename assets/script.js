var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#current-weather-card"); 
var citySearchEl = document.querySelector("#searched-city");
var forecastTitleEl = document.querySelector("#forecast");
var forecastCardEl = document.querySelector("#fiveday-card");
var pastSearchBtnEl = document.querySelector("#past-search-btn"); 

var cities = []; 

var formSubmitHandler = function(event) {
    event.preventDefault();

    var city = cityInputEl.value.trim();
    if(city) {
        getCityWeather(city);
        getFiveDay(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else {
        alert("PLease enter a valid city.");
    }

    saveSearch();
    pastSearch();
}

var saveSearch = function() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// api & key to retrieve weather info
var getCityWeather = function(city) {
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}` 

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayWeather(data, city);
        });
    });
};

// function that shows weather on screen
var displayWeather = function(weather, searchCity) {
    currentWeatherEl.textContent = "";
    citySearchEl.textContent = searchCity;

    // date
    var currentDate = document.createElement("span");
    currentDate.textContent = " (" + moment(weather.dt.value).format("MM/DD/YYYY") + ") ";
    citySearchEl.appendChild(currentDate);

    // weather image on screen
    var weatherImg = document.createElement("img");
    weatherImg.setAttribute("src", "https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png");
    citySearchEl.appendChild(weatherImg); 

    // data for temp
    var tempEl = document.createElement("span");
    tempEl.textContent = "Temperature: " + weather.main.temp + " &deg F";
    tempEl.classList = "list-group-item";

    // for humidity 
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.huidity + "%";
    humidityEl.classList = "list-group-item";

    // wind data
    var windEl = document.createElement("span");
    windEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windEl.classList = "list-group-item";

    currentWeatherEl.appendChild(tempEl);

    currentWeatherEl.appendChild(humidityEl);

    currentWeatherEl.appendChild(windEl);

    // UV index
    var lattitude = weather.coord.lat;
    var longitude = weather.coord.lon;
    getUVI(lattitude, longitude);
};

// fucntion to get UV Index
var getUVI = function(lat, lon) {
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayUVI(data);
        });
    });
};

// function to display UVI
var displayUVI = function(index) {
    var UVIndexEl = document.createElement("div");
    UVIndexEl.textContent = "UV Index: "
    UVIndexEl.classList = "list-group-item"

    UVIndexVal = document.createElement("span");
    UVIndexVal.textContent = index.value

    if(index.value <= 2) {
        UVIndexVal.classList = "favorable"
    } else if (index.value > 2 && index.value <=8) {
        UVIndexVal.classList = "moderate"
    } else if (index.value > 8) {
        UVIndexVal.classList = "severe"
    };

    UVIndexEl.appendChild(UVIndexVal);

    currentWeatherEl.appendChild(UVIndexEl);
};

// 5 day forecast section
var getFiveDay = function(city) {
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayFiveDay(data);
        });
    });
};

var displayFiveDay = function(weather) {
    forecastCardEl.textContent = "";
    forecastTitleEl.textContent = "5 Day Forecast:";

    var forecast = weather.list;
    for(var i=5; i < forecast.length; i=i+8) { 
        var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    forecastEl.classList = "card bg-primary text-light m-2";

    // dates fpr forecast
    var forecastDate = document.createElement("h4")
    forecastDate.textContent = moment.unix(dailyForecast.dt).format("MM/DD/YYYY");
    forecastDate.classList = "card-header text-center"
    forecastEl.appendChild(forecastDate); 

    // weather img
    var weatherImg = document.createElement("img")
    weatherImg.classList = "card-bodytext-center";
    weatherImg.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

    forecastEl.appendChild(weatherImg);

    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card=body text-center";
    forecastTempEl.textContent = dailyForecast.main.temp + " &degF";

    forecastEl.appendChild(forecastTempEl);

    // humidity
    var forecastHumidEl = document.createElement("span");
    forecastHumidEl.classList = "card-body text-center";
    forecastHumidEl.textContent = dailyForecast.main.humidity + "%"; 

    forecastEl.appendChild(forecastHumidEl);

    forecastCardEl.appendChild(forecastEl); 
    };
};

// past searches
var pastSearch = function(pastSearch) {
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch);
    pastSearchEl.setAttribute("type", "submit");

    pastSearchBtnEl.prepend(pastSearchEl);
};

var pastHandler = function(event) {
    var city = event.target.getAttribute("data-city")
    if(city) {
        getCityWeather(city);
        getFiveDay(city);
    };
};

cityFormEl.addEventListener("submit", formSubmitHandler);
pastSearchBtnEl.addEventListener("click", pastHandler);