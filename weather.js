const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");

const weatherMessage = document.getElementById("weather-message");
const weatherCard = document.getElementById("weather-card");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");


// Search weather when the user submits the form
weatherForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    // Check if the input is empty
    if (!city) {
        weatherMessage.textContent = "Please enter a city name.";
        weatherCard.hidden = true;
        return;
    }

    weatherMessage.textContent = "Loading weather...";
    weatherCard.hidden = true;

    try {

        // --------------------------------
        // STEP 1: Find the city
        // --------------------------------

        const locationURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;

        const locationResponse = await fetch(locationURL);

        if (!locationResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const locationData = await locationResponse.json();

        // Check whether the city exists
        if (!locationData.results || locationData.results.length === 0) {
            throw new Error(
                "City not found. Please check the spelling and try again."
            );
        }

        // Use the first matching city
        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // --------------------------------
        // STEP 2: Get weather data
        // --------------------------------

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to retrieve weather information.");
        }

        const weatherData = await weatherResponse.json();


        // --------------------------------
        // STEP 3: Display weather
        // --------------------------------

        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            `${weatherData.current.temperature_2m} °C`;

        humidity.textContent =
            `${weatherData.current.relative_humidity_2m}%`;

        windSpeed.textContent =
            `${weatherData.current.wind_speed_10m} km/h`;


        // Show the weather card
        weatherMessage.textContent =
            "Weather information updated successfully.";

        weatherCard.hidden = false;

    }

    // --------------------------------
    // STEP 4: Error handling
    // --------------------------------

    catch (error) {

        console.error("Weather Error:", error);

        weatherMessage.textContent =
            error.message || "Something went wrong. Please try again.";

        weatherCard.hidden = true;
    }

});