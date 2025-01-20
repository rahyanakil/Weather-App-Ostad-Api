const emptyInput = document.getElementById("empty-input");
const searchBtn = document.getElementById("search-button");
const locationBtn = document.getElementById("current-location");
const api = "3be9bc24b0ed1677cda7f552b34791ce"; // Your API Key

// Search weather by city name
searchBtn.addEventListener("click", () => searchWeather());

document.getElementById("search-city").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// Get weather for current location
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                loadSearchByCoords(latitude, longitude);
            },
            (error) => {
                emptyInput.innerHTML = `<h4 class="text-danger mt-2">Geolocation access denied.</h4>`;
            }
        );
    } else {
        emptyInput.innerHTML = `<h4 class="text-danger mt-2">Geolocation not supported.</h4>`;
    }
});

// Search weather function
const searchWeather = () => {
    const searchInput = document.getElementById("search-city");
    const cityName = searchInput.value.trim();
    emptyInput.textContent = "";

    if (cityName === "") {
        emptyInput.innerHTML = `<h4 class="text-start text-danger mt-2">Please enter a city name to search...</h4>`;
        return;
    }

    searchInput.value = "";
    loadSearch(cityName);
};

// Load weather data by city name
const loadSearch = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`;
    fetchWeatherData(url);
};

// Load weather data by coordinates
const loadSearchByCoords = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`;
    fetchWeatherData(url);
};

// Fetch API and display weather
const fetchWeatherData = async (url) => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        displayWeather(data);
    } catch (error) {
        console.log("Error fetching data:", error);
    }
};

// Display weather data
const displayWeather = (weatherData) => {
    if (weatherData.cod === "404") {
        emptyInput.innerHTML = `<h4 class="text-start text-danger mt-2">City not found...</h4>`;
        return;
    }

    const container = document.getElementById("container");
    container.textContent = "";

    const { name, sys, main, weather, wind } = weatherData;
    const localDate = convertUnixTimeToLocal(weatherData.dt);
    const sunriseTime = convertUnixTimeToLocal(weatherData.sys.sunrise);
    const sunsetTime = convertUnixTimeToLocal(weatherData.sys.sunset);

    const weatherCondition = weather[0].main.toLowerCase();
    changeBackground(weatherCondition);

    const div = document.createElement("div");
    div.innerHTML = `
        <h4 class="fs-2">${name}, ${sys.country}</h4>
        <h6>${localDate.fullDate}</h6>
        <h5>${weather[0].description.toUpperCase()}</h5>
        <h5>🌡 Temperature: ${main.temp}°C</h5>
        <h5>💨 Wind Speed: ${wind.speed} m/s</h5>
        <h5>💧 Humidity: ${main.humidity}%</h5>
        <h5>🌅 Sunrise: ${sunriseTime.time12h} | 🌇 Sunset: ${sunsetTime.time12h}</h5>
    `;

    container.appendChild(div);
};

// Convert UNIX timestamp to local date/time
const convertUnixTimeToLocal = (unixTime) => {
    const milliSeconds = unixTime * 1000;
    const humanDateFormat = new Date(milliSeconds);

    return {
        fullDate: humanDateFormat.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        time12h: humanDateFormat.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }),
    };
};

// Change background based on weather
const changeBackground = (weatherCondition) => {
    const weatherImages = {
        clear: "clear.jpg",
        clouds: "cloudy.jpg",
        rain: "rain.jpg",
        thunderstorm: "thunderstorm.jpg",
        snow: "snow.jpg",
        mist: "mist.jpg",
        fog: "fog.jpg",
        haze: "haze.jpg",
    };

    const image = weatherImages[weatherCondition] || "default.jpg";

};

// Load default weather (Dhaka)
loadSearch("Dhaka");
