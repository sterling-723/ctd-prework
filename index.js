const weatherForm = document.querySelector(".weatherForm");
const latitudeInput = document.querySelector(".latitudeInput");
const longitudeInput = document.querySelector(".longitudeInput");
const weatherCard = document.querySelector(".weatherCard");

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const latitude = parseFloat(latitudeInput.value).toFixed(6);
  const longitude = parseFloat(longitudeInput.value).toFixed(6);

  if (latitude && longitude) {
    try {
      const weatherData = await getWeatherData(latitude, longitude);
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.error(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a valid latitude and longitude!");
  }
});

async function getWeatherData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,cloud_cover,weather_code&temperature_unit=fahrenheit&wind_speed_unit=ms&precipitation_unit=inch&forecast_days=1`;

  const response = await fetch(apiUrl);
  console.log(response);

  if (!response.ok) {
    throw new Error("Could not fetch weather data!");
  }
  return await response.json();
}
function displayWeatherInfo(data) {
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

  const cardTemp = document.createElement("h1");
  const cardHumidity = document.createElement("p");
  const cardClouds = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cardTemp.textContent = `${temp.toFixed(1)} °F`;
  cardHumidity.textContent = `Humidity: ${humidity}%`;
  cardClouds.textContent = `Cloud Coverage: ${clouds}%`;
  weatherEmoji.textContent = getWeatherEmoji(weather_code);

  cardTemp.classList.add("cityTemp");
  cardClouds.classList.add("cloudDesc");
  cardHumidity.classList.add("cityHumidity");
  weatherEmoji.classList.add("weatherEmoji");

  weatherCard.appendChild(cardTemp);
  weatherCard.appendChild(cardHumidity);
  weatherCard.appendChild(cardClouds);
  weatherCard.appendChild(weatherEmoji);
}
function getWeatherEmoji(weatherId) {
  if (weatherId < 200) {
    return "☀️";
  } else if (weatherId > 200) {
    return "⛈️";
  } else if (weatherId < 531) {
    return "🌧️";
  } else if (weatherId < 622) {
    return "☃️";
  } else if (weatherId == 711 || weatherId == 721) {
    return "🔥";
  } else if (weatherId < 762) {
    return "🌋";
  } else if (weatherId == 781) {
    return "🌪️";
  } else if (weatherId >= 801 && weatherId <= 802) {
    return "🌤️";
  } else if (weatherId >= 803 && weatherId <= 804) {
    return "⛅️";
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
