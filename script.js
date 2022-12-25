const API_KEY = `983095bb3517a0e4d1813c9053e1b997`;

const DAYS_OF_THE_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

let selectedCityText;
let selectedCity = { lat: "19.191961", lon: "72.815414" };

const formatTemperature = (temp) => `${temp?.toFixed(1)}°`;
const createIconUrl = (icon) => ` http://openweathermap.org/img/wn/${icon}@2x.png`;

const getCititesUsingGeolocation = async (searchInp) => {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchInp}&limit=5&appid=${API_KEY}`);
  return response.json();
}

const getCurrentWeatherData = async ({ lat, lon, name }) => {
  const url = lat && lon ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
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

const getHourlyWeatherData = async ({ name: city }) => {
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

const loadForecastUsingGeolocation = () => {
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const { latitude: lat, longitude: lon } = coords;
    selectedCity = { lat, lon };
    loadData();
  }, error => console.log(error));
}

const debounce = (func) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, 750);
  }
}

const onSearchTextChange = async (event) => {
  let { value } = event.target;
  if (!value) {
    selectedCity = null;
    selectedCityText = "";
  }
  if (value && selectedCityText !== value) {
    const listOfCities = await getCititesUsingGeolocation(value);
    let options = ``;

    for (let { lat, lon, name, state, country } of listOfCities) {
      options += `
      <option data-city-details='${JSON.stringify({ lat, lon, name })}' value="${name}, ${state}, ${country}"></option
      `;
    }
    document.querySelector("#cities").innerHTML = options;
  }
}

const debounceSearch = debounce((event) => onSearchTextChange(event));

const onCityChange = (event) => {
  selectedCityText = event.target.value;
  let options = document.querySelectorAll("#cities > option");
  if (options?.length) {
    let selectedOption = Array.from(options).find(option => option.value === selectedCityText);
    selectedCity = JSON.parse(selectedOption.getAttribute('data-city-details'));

    loadData();
  }
}

const loadData = async () => {
  const currentWeather = await getCurrentWeatherData(selectedCity);
  loadCurrentForecast(currentWeather);
  const hourlyWeather = await getHourlyWeatherData(currentWeather);
  loadHourlyForecast(currentWeather, hourlyWeather);
  setFeelsLike(currentWeather);
  setHumidity(currentWeather);
  loadFivedayForecast(hourlyWeather);
}

const loading = () => {
  const bodyElement = document.querySelector(".container");
  const loader = document.querySelector("#loader");

  loader.style.opacity = "100%";
  setTimeout(() => {
    loader.style.opacity = "0%";
    bodyElement.style.opacity = "100%";
    setTimeout(() => {
      loader.style.display = "none";
    }, 1000);
  }, 2500);
}
document.addEventListener("DOMContentLoaded", async () => {
  const redBtn = document.querySelector("#red");
  const yellowBtn = document.querySelector("#yellow");
  const greenBtn = document.querySelector("#green");
  const svgElement = document.querySelector(".wave");

  const location = document.querySelector(".location-btn");
  loading();
  loadData();
  location.addEventListener("click", () => {
    loadForecastUsingGeolocation();
  })
  const search = document.querySelector("#search");
  search.addEventListener("input", debounceSearch);
  search.addEventListener("change", onCityChange);

  redBtn.addEventListener('click', () => {
    svgElement.innerHTML = `
    <g mask="url(&quot;#SvgjsMask1154&quot;)" fill="none">
        <rect width="1440" height="560" x="0" y="0" fill="url(#SvgjsLinearGradient1155)"></rect>
        <path d="M 0,60 C 72,89.8 216,209.8 360,209 C 504,208.2 576,61.4 720,56 C 864,50.6 936,175.6 1080,182 C 1224,188.4 1368,106.8 1440,88L1440 560L0 560z" fill="rgba(117, 35, 35, 1)"></path>
        <path d="M 0,334 C 144,354 432,434.6 720,434 C 1008,433.4 1296,351.6 1440,331L1440 560L0 560z" fill="rgba(143, 22, 22, 1)"></path>
    </g>
    <defs>
        <mask id="SvgjsMask1154">
            <rect width="1440" height="560" fill="#ffffff"></rect>
        </mask>
        <linearGradient x1="15.28%" y1="-39.29%" x2="84.72%" y2="139.29%" gradientUnits="userSpaceOnUse" id="SvgjsLinearGradient1155">
            <stop stop-color="#0e2a47" offset="0"></stop>
            <stop stop-color="rgba(200, 27, 27, 1)" offset="1"></stop>
        </linearGradient>
    </defs>
    `;
  });

  yellowBtn.addEventListener('click', () => {
    svgElement.innerHTML = `
    <g mask="url(&quot;#SvgjsMask1223&quot;)" fill="none">
      <rect width="1440" height="560" x="0" y="0" fill="url(#SvgjsLinearGradient1224)"></rect>
      <path
        d="M 0,60 C 72,89.8 216,209.8 360,209 C 504,208.2 576,61.4 720,56 C 864,50.6 936,175.6 1080,182 C 1224,188.4 1368,106.8 1440,88L1440 560L0 560z"
        fill="rgba(83, 83, 5, 1)"></path>
      <path d="M 0,334 C 144,354 432,434.6 720,434 C 1008,433.4 1296,351.6 1440,331L1440 560L0 560z"
        fill="rgba(150, 127, 21, 1)"></path>
    </g>
    <defs>
      <mask id="SvgjsMask1223">
        <rect width="1440" height="560" fill="#ffffff"></rect>
      </mask>
      <linearGradient x1="15.28%" y1="-39.29%" x2="84.72%" y2="139.29%" gradientUnits="userSpaceOnUse"
        id="SvgjsLinearGradient1224">
        <stop stop-color="#0e2a47" offset="0"></stop>
        <stop stop-color="rgba(108, 110, 46, 1)" offset="1"></stop>
      </linearGradient>
    </defs>
    `;
  });

  greenBtn.addEventListener('click', () => {
    document.documentElement.style.setProperty('--dark', getComputedStyle(document.documentElement).getPropertyValue('--green'));
    svgElement.innerHTML = `
    <g mask="url(&quot;#SvgjsMask1390&quot;)" fill="none">
        <rect width="1440" height="560" x="0" y="0" fill="url(#SvgjsLinearGradient1391)"></rect>
        <path d="M 0,102 C 144,127.4 432,244 720,229 C 1008,214 1296,67.4 1440,27L1440 560L0 560z" fill="rgba(23, 94, 37, 1)"></path>
        <path d="M 0,352 C 72,392.6 216,549.2 360,555 C 504,560.8 576,395.8 720,381 C 864,366.2 936,497.6 1080,481 C 1224,464.4 1368,334.6 1440,298L1440 560L0 560z" fill="rgba(20, 81, 36, 1)"></path>
    </g>
    <defs>
        <mask id="SvgjsMask1390">
            <rect width="1440" height="560" fill="#ffffff"></rect>
        </mask>
        <linearGradient x1="15.28%" y1="-39.29%" x2="84.72%" y2="139.29%" gradientUnits="userSpaceOnUse" id="SvgjsLinearGradient1391">
            <stop stop-color="#0e2a47" offset="0"></stop>
            <stop stop-color="rgba(27, 124, 16, 1)" offset="1"></stop>
        </linearGradient>
    </defs>
    `;
  });
});