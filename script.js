const API_KEY = `983095bb3517a0e4d1813c9053e1b997`;
const DAYS_OF_THE_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;
const createIconUrl = (icon) => ` http://openweathermap.org/img/wn/${icon}@2x.png`;

const getCurrentWeatherData = async (city) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  return response.json();
}

const loadCurrentForecast = ({ name, main: { temp, temp_max, temp_min }, weather: [{ description }] }) => {
  const currentForecast = document.querySelector
    ("#current-forecast");
  currentForecast.querySelector(".location").innerHTML = `${name}`;
  currentForecast.querySelector(".temp").innerHTML = formatTemperature(temp);
  currentForecast.querySelector(".status").innerHTML = `${description}`;
  currentForecast.querySelector(".min-max-temp").innerHTML = `L: ${formatTemperature(temp_min)} & H: ${formatTemperature(temp_max)}`;
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

const loadHourlyForecast = ({ main: { temp: tempNow }, weather: [{ icon: iconNow }] }, hourlyForecast) => {
  const timeFormatter = Intl.DateTimeFormat("en", {
    hour12: true, hour: "numeric"
  });
  let hourlyData = hourlyForecast.slice(2, 14);
  const hourlyContainer = document.querySelector(".hourly-forecast-container");
  let innerHTMLSting = `
  <article>
    <h3 class="time">Now</h3>
    <img class="icon" src="${createIconUrl(iconNow)}" alt="weather-icon">
    <p class="hourly_temp">${formatTemperature(tempNow)}</p>
  </article>
  `;
  for (let { temp, icon, dt_txt } of hourlyData) {
    innerHTMLSting += `
    <article>
      <h3 class="time">${timeFormatter.format(new Date(dt_txt))}</h3>
      <img class="icon" src="${createIconUrl(icon)}" alt="weather-icon">
      <p class="hourly_temp">${formatTemperature(temp)}</p>
    </article>
    `
  }
  hourlyContainer.innerHTML = innerHTMLSting;
}

const calculateDaywiseForecast = (hourlyWeather) => {
  let daywiseForecast = new Map();
  for (let forecast of hourlyWeather) {
    const [date] = forecast.dt_txt.split(" ");
    const dayOfTheWeek = DAYS_OF_THE_WEEK[new Date(date).getDay()];
    if (daywiseForecast.has(dayOfTheWeek)) {
      let forecastForTheDay = daywiseForecast.get(dayOfTheWeek);
      forecastForTheDay.push(forecast);
      daywiseForecast.set(dayOfTheWeek, forecastForTheDay);
    } else {
      daywiseForecast.set(dayOfTheWeek, [forecast])
    }
  }
  for (let [key, value] of daywiseForecast) {
    let temp_min = Math.min(...Array.from(value, val => val.temp_min));
    let temp_max = Math.max(...Array.from(value, val => val.temp_max));

    daywiseForecast.set(key, { temp_min, temp_max, icon: value.find(v => v.icon).icon })
  }
  return daywiseForecast;
}

const loadFivedayForecast = (hourlyWeather) => {
  const daywiseForecast = calculateDaywiseForecast(hourlyWeather);
  const docFivedayForecastContainer = document.querySelector(".fiveday-forecast-container");
  let innerHTMLString = ``;
  // console.log(daywiseForecast)
  // const log = Array.from(daywiseForecast).map(entry => {
  //   const day = entry[0];
  //   const { temp_max, temp_min, icon } = entry[1]
  //   const data = { day, temp_max, temp_min, icon }
  //   return (
  //     console.log(data)
  //   )
  // });

  Array.from(daywiseForecast).map(([day, { temp_max, temp_min, icon }], index) => {
    if (index < 5) {
      innerHTMLString += `
      <article>
        <h3 class="day">${index === 0 ? "Today" : day}</h3>
        <img class="icon" src="${createIconUrl(icon)}" alt="temp-icon">
        <p class="min-temp">${formatTemperature(temp_min)}</p>
        <p class="max-temp">${formatTemperature(temp_max)}</p>
      </article>
      `;
    }
  });
  docFivedayForecastContainer.innerHTML = innerHTMLString;

}

const setFeelsLike = ({ main: { feels_like } }) => {
  const feelsLikeContainer = document.querySelector("#feels-like");
  feelsLikeContainer.querySelector(".feelslike-txt").innerHTML = `${formatTemperature(feels_like)}`;
}

const setHumidity = ({ main: { humidity } }) => {
  const feelsLikeContainer = document.querySelector("#humidity");
  feelsLikeContainer.querySelector(".humidity-txt").innerHTML = `${humidity}%`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const currentWeather = await getCurrentWeatherData("mumbai");
  loadCurrentForecast(currentWeather);
  const hourlyWeather = await getHourlyWeatherData("mumbai");
  loadHourlyForecast(currentWeather, hourlyWeather);
  setFeelsLike(currentWeather);
  setHumidity(currentWeather);
  loadFivedayForecast(hourlyWeather);
});
