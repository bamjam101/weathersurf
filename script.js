const API_KEY = `983095bb3517a0e4d1813c9053e1b997`;


const getCurrentWeatherData = async (city) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  return response.json();
}

const getHourlyWeatherData = async (city) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
  const data = await response.json();
  return data.list.map(forecast => {
    const { main: { temp, temp_max, temp_min }, dt, dt_txt, weather: [{ description, icon }]
    } = forecast;
    return { temp, temp_max, temp_min, dt, dt_txt, description, icon };
  }
  )
}

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;
const createIconUrl = (icon) => ` http://openweathermap.org/img/wn/${icon}@2x.png`;

const loadCurrentForecast = ({ name, main: { temp, temp_max, temp_min }, weather: [{ description }] }) => {
  const currentForecast = document.querySelector
    ("#current-forecast");
  currentForecast.querySelector(".location").innerHTML = `${name}`;
  currentForecast.querySelector(".temp").innerHTML = formatTemperature(temp);
  currentForecast.querySelector(".status").innerHTML = `${description}`;
  currentForecast.querySelector(".min-max-temp").innerHTML = `L: ${formatTemperature(temp_min)} & H: ${formatTemperature(temp_max)}`;
}

const loadHourlyForecast = (hourlyForecast) => {
  let hourlyData = hourlyForecast.slice(1, 13);
  const hourlyContainer = document.querySelector(".hourly-forecast-container");
  let innerHTMLSting = ``;
  for (let { temp, icon, dt_txt } of hourlyData) {
    innerHTMLSting += `
    <article>
          <h2 class="time">${dt_txt.split(" ")[1]}</h2>
          <img class="icon" src="${createIconUrl(icon)}" alt="weather-icon">
          <p class="hourly_temp">${formatTemperature(temp)}</p>
    </article>
    `
  }
  hourlyContainer.innerHTML = innerHTMLSting;

}

const setHumidity = ({ main: { humidity } }) => {
  const feelsLikeContainer = document.querySelector("#humidity");
  feelsLikeContainer.querySelector(".humidity-txt").innerHTML = `${humidity}%`;
}

const setFeelsLike = ({ main: { feels_like } }) => {
  const feelsLikeContainer = document.querySelector("#feels-like");
  feelsLikeContainer.querySelector(".feelslike-txt").innerHTML = `${formatTemperature(feels_like)}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const currentWeather = await getCurrentWeatherData("mumbai");
  loadCurrentForecast(currentWeather);
  const hourlyWeather = await getHourlyWeatherData("mumbai");
  loadHourlyForecast(hourlyWeather);
  setFeelsLike(currentWeather);
  setHumidity(currentWeather);
});
