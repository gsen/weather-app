
// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// App data
const cord = {};


// APP CONSTS AND VARS
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const KELVIN = 273;
// API KEY
const key = "8d71755b68a278278ef9ec912a46e649";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
    getAllWeather(false).then((weatherData) => {
        displayWeather(weatherData);
    })
}

// SET USER'S POSITION
function setPosition(position) {
    cord.latitude = position.coords.latitude;
    cord.longitude = position.coords.longitude;
    getAllWeather().then((weatherData) => {
        displayWeather(weatherData);
    })
}



// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getAllWeather(location = true) {

    const currentWeatherApi = `${BASE_URL}?lat=${cord.latitude}&lon=${cord.longitude}&appid=${key}`;

    const currentWeather = getWeather(currentWeatherApi);
    const tokyoWeather = getWeather(`${BASE_URL}?q=tokyo&appid=${key}`);
    const londonWeather = getWeather(`${BASE_URL}?q=london&appid=${key}`);
    const weatherPromises = [currentWeather, tokyoWeather, londonWeather];
    if(!location){
        weatherPromises.splice(0,1);
    }
    return Promise.all(weatherPromises).then(values => values);
}

const getWeather = (url) => fetch(url).then(resp => resp.json())

// DISPLAY WEATHER TO UI
function displayWeather(weatherData) {
    let weatherInfo = ''
    for (const weather of weatherData) {
        weatherInfo +=
            `
            <div class="container">
                <div class="app-title">
                <p>${weather.name}</p>
            </div>
            <div class="notification"> </div>
            <div class="weather-container">
                <div class="weather-icon">
                    <img src="icons/${weather.weather[0].icon}.png" alt="">
                </div>
                <div class="temperature-value">
                    <p data="${weather.main.temp}" onclick="onTempratureClick(this)">${Math.floor(weather.main.temp - KELVIN)}°<span >C</span></p>
                </div>
                <div class="temperature-description">
                    <p> ${weather.weather[0].description} </p>
                </div>
                <div class="location">
                    <p>${weather.name}, ${weather.sys.country}</p>
                </div>
            </div>
        </div>`
    }

    document.querySelector('.main-container').innerHTML = weatherInfo;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
function onTempratureClick(element) {
    console.log(element);
    if (element && element.innerText) {
        const text = element.innerText;
        const splitData = text.split('°');
        if (splitData[1] === 'C') {
            let fahrenheit = celsiusToFahrenheit(splitData[0]);
            fahrenheit = Math.floor(fahrenheit);
            element.innerHTML = `${fahrenheit}°<span>F</span>`;

        } else {
            element.innerHTML = `${Math.floor(element.getAttribute('data') - KELVIN)}°<span>C</span>`;
        }
    }
};

