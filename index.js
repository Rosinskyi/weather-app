const input = document.getElementById('text');
const label = document.getElementById('text__label');
const cleanUp = document.querySelector('.text__cleanup');

const todayIcon = document.querySelector('.today__icon');
const temperatureNow = document.querySelector('.temperature__now');
const temperatureFeels = document.querySelector('.temperature__feels');
const cloudsToday = document.querySelector('.clouds__type');
const cloudsCity = document.querySelector('.clouds__city');

const forecastDay = document.getElementsByClassName('card__day');
const forecastClouds = document.getElementsByClassName('card__clouds');
const forecastImage = document.getElementsByClassName('clouds__img');
const forecastLowTemp = document.getElementsByClassName('temperature__low');
const forecastHighTemp = document.getElementsByClassName('temperature__high');

input.onchange = (e) => {
    document.querySelector('.weather__content').style.display = 'block';
    const forecastData = {
        day: [],
        clouds: [],
        icons: [],
        temperature: {
            low: [],
            high: []
        }
    };

    getWeather(input.value)
        .then((data) => {
            const tempToday = Math.floor(data.main.temp);
            const tempFeelsToday = Math.floor(data.main.feels_like);
            const clouds = data.weather[0];

            temperatureNow.firstElementChild.innerHTML = tempToday;
            temperatureFeels.firstElementChild.innerHTML = tempFeelsToday;
            cloudsToday.innerHTML = clouds.description;
            cloudsCity.innerHTML = `${data.name}, ${data.sys.country}`;
            todayIcon.firstElementChild.setAttribute(
                'src',
                `http://openweathermap.org/img/wn/${clouds.icon}@2x.png`
            );
            label.firstElementChild.innerHTML = input.value;
        })
        .catch((error) => {
            console.error(error);
        });
    getForecast(input.value)
        .then((data) => {
            data.forEach((i) => {
                if (new Date().getDay() !== new Date(i.dt_txt).getDay()) {
                    if (
                        forecastData.day.indexOf(
                            new Date(i.dt_txt).toLocaleDateString('en-US', {
                                weekday: 'short'
                            })
                        ) === -1
                    ) {
                        forecastData.day.push(
                            new Date(i.dt_txt).toLocaleDateString('en-US', {
                                weekday: 'short'
                            })
                        );
                    }
                    if (new Date(i.dt_txt).getHours() === 9) {
                        forecastData.clouds.push(i.weather[0].description);
                        forecastData.icons.push(i.weather[0].icon);
                    }
                    if (new Date(i.dt_txt).getHours() === 3) {
                        forecastData.temperature.low.push(
                            Math.floor(i.main.temp_min)
                        );
                    }

                    if (new Date(i.dt_txt).getHours() === 12) {
                        forecastData.temperature.high.push(
                            Math.floor(i.main.temp_max)
                        );
                    }
                }
            });
            for (let index = 0; index < 5; index++) {
                forecastDay[index].innerHTML = forecastData.day[index];
                forecastClouds[index].innerHTML = forecastData.clouds[index];
                forecastImage[
                    index
                ].src = `http://openweathermap.org/img/wn/${forecastData.icons[index]}@2x.png`;
                forecastLowTemp[index].innerHTML =
                    forecastData.temperature.low[index];
                forecastHighTemp[index].innerHTML =
                    forecastData.temperature.high[index];
            }
        })
        .catch((error) => {
            console.error(error);
        });
};

cleanUp.onclick = () => {
    input.value = '';
    label.firstElementChild.innerHTML = '';
};
async function getWeather(...region) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${region}&appid=b98c0b7f365379e61f86e7da30e4ed56&units=metric`
    );

    return await response.json();
}

async function getForecast(...region) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${region}&appid=b98c0b7f365379e61f86e7da30e4ed56&units=metric`
    );

    const data = await response.json();

    return data.list;
}
