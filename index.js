const weatherForm = document.querySelector(".weatherForm");
const latitudeInput = document.querySelector(".latitudeInput");
const longitudeInput = document.querySelector(".longitudeInput");
const cityInput = document.querySelector(".cityInput");
const weatherCard = document.querySelector(".weatherCard");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // const latitude = parseFloat(latitudeInput.value).toFixed(6);
  // const longitude = parseFloat(longitudeInput.value).toFixed(6);
  const city = cityInput.value.toLowerCase();

  if (city) {
    try {
      const cityData = await getCityData(city);
      console.log(cityData);

      if (cityData.results && cityData.results.length > 0) {
        const { latitude, longitude, name } = cityData.results[0];
        const weatherData = await getWeatherData(latitude, longitude);
        displayWeatherInfo(weatherData, name);
        console.log(
          `Latitude: ${latitude}, Longitude: ${longitude}, City: ${name}`
        );
      } else {
        console.log("No results found for the specified city.");
      }
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  }
});

// });

async function getCityData(city) {
  const apiURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;
  const response = await fetch(apiURL);

  if (!response.ok) {
    throw new Error("Could not fetch city data!");
  }
  return await response.json();
}

async function getWeatherData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,cloud_cover,weather_code&temperature_unit=fahrenheit&wind_speed_unit=ms&precipitation_unit=inch&forecast_days=1`;

  const response = await fetch(apiUrl);
  console.log(response);

  if (!response.ok) {
    throw new Error("Could not fetch weather data!");
  }
  return await response.json();
}
function displayWeatherInfo(data, name) {
  const {
    current: {
      temperature_2m: temp,
      cloud_cover: clouds,
      relative_humidity_2m: humidity,
      weather_code,
    },
  } = data;
  weatherCard.textContent = "";
  weatherCard.style.display = "flex";
  console.log(weather_code);

  const cardCity = document.createElement("h1");
  const cardTemp = document.createElement("h1");
  const cardHumidity = document.createElement("p");
  const cardClouds = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cardCity.textContent = name;
  cardTemp.textContent = `${temp.toFixed(1)} °F`;
  cardHumidity.textContent = `Humidity: ${humidity}%`;
  cardClouds.textContent = `Cloud Coverage: ${clouds}%`;
  weatherEmoji.textContent = getWeatherEmoji(weather_code);

  cardCity.classList.add("cityHeader");
  cardTemp.classList.add("cityTemp");
  cardClouds.classList.add("cloudDesc");
  cardHumidity.classList.add("cityHumidity");
  weatherEmoji.classList.add("weatherEmoji");

  weatherCard.appendChild(cardCity);
  weatherCard.appendChild(cardTemp);
  weatherCard.appendChild(cardHumidity);
  weatherCard.appendChild(cardClouds);
  weatherCard.appendChild(weatherEmoji);
}
function getWeatherEmoji(weatherId) {
  if (weatherId === 0) {
    return "☀️";
  } else if (weatherId === 1) {
    return "🌤️";
  } else if (weatherId === 2) {
    return "⛅️";
  } else if (weatherId === 3) {
    return "☁️";
  } else if (weatherId === 45) {
    return "🌫️";
  } else if (weatherId === 51 || weatherId === 53 || weatherId === 55) {
    return "☔️";
  } else if (weatherId >= 61 && weatherId <= 82) {
    return "🌧️";
  } else if (weatherId >= 83 && weatherId <= 87) {
    return "☃️";
  } else if (weatherId >= 95 && weatherId <= 99) {
    return "⛈️";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");
  weatherCard.textContent = "";
  weatherCard.style.display = "flex";
  weatherCard.appendChild(errorDisplay);
}
