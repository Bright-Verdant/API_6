

const key = "7df267f0ff28e9b7587545593694d0c0";
const url = `https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid=${key}`;

let recentCities = [];

async function getWeather(city) {
  try {
    const response = await fetch(url.replace("{city_name}", city));
    const data = await response.json();
    const fiveDayForecast = data.list.filter(reading => reading.dt_txt.includes("12:00:00"));

    addCityToRecent(city);

    return fiveDayForecast;
  } catch (error) {
    console.error(error);
    return error;
  }
}



function displayForecast(forecast, cityName) {
    const forecastContainer = document.querySelector("#forecast-container");
    forecastContainer.innerHTML = "";
  
    const cityHeader = `<h1>${cityName}</h1>`;
    forecastContainer.insertAdjacentHTML("beforebegin", cityHeader);
  
    forecast.forEach(reading => {
      const date = new Date(reading.dt * 1000).toLocaleDateString();
      const temperature = Math.round(reading.main.temp - 273.15);
      const icon = reading.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;
  
      const forecastItem = `
        <div class="forecast-item">
          <div class="forecast-date">${date}</div>
          <img src="${iconUrl}" alt="weather icon" />
          <div class="forecast-temperature">${temperature}°C</div>
        </div>
      `;
  
      forecastContainer.insertAdjacentHTML("beforeend", forecastItem);
    });
  }
  

function addCityToRecent(city) {
  recentCities.unshift(city);
  recentCities.splice(5);
  localStorage.setItem("recentCities", JSON.stringify(recentCities));
  displayRecentCities();
}

function displayRecentCities() {
  const recentContainer = document.querySelector("#recent-container");
  recentContainer.innerHTML = "";

  recentCities.forEach((city, index) => {
    const button = `
      <button class="recent-city" data-city="${city}">${city}</button>
    `;

    recentContainer.insertAdjacentHTML("beforeend", button);
  });

  const recentCityButtons = document.querySelectorAll(".recent-city");
  recentCityButtons.forEach(button => {
    button.addEventListener("click", event => {
      const city = event.target.getAttribute("data-city");
      getWeather(city).then(displayForecast);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  displayRecentCities();
});

document.querySelector("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  const city = document

 
  .querySelector("#city-input").value;
  getWeather(city).then(displayForecast);
  
  });

  getWeather(city).then(forecast => displayForecast(forecast, city));










