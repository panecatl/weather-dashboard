var cityFormEl = document.querySelector("#city-search-form");
var cityInputEl = document.querySelector("#city");
var currentWeatherEl = document.querySelector("#current-weather-card"); 
var citySearchEl = document.querySelector("#searched-city");
var forecastTitleEl = document.querySelector("#fivesay-card");
var pastSearchBtnEl = document.querySelector("#past-search-btn"); 

var cities = []; 

var formSubmitHandler = function(event) {
    event.preventDefaul();

    var city = cityInputEl.ariaValueMax.trim();
    if(city) {
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else {
        alert("PLease enter a valid city.");
    }
}