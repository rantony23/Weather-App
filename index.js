class WeatherApi{
    

    async #cityFetchData(city){
        let secondBaseURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`;

        try {
            const response = await fetch(secondBaseURL);
            const data = await response.json();
            return {
                latitude: data.results[0].latitude,
                longitude: data.results[0].longitude,
                name:data.results[0].name,
                country:data.results[0].country,
            };
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async nameCity(city){
        const location = await this.#cityFetchData(city);
        return {
            city:location.name,
            country:location.country,
        };
    }

    async getCity(city){
        const location =  await this.#cityFetchData(city);
        if(!location)return null;
        let baseURL =`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_80m,apparent_temperature,weather_code&models=icon_seamless&current=temperature_2m,weather_code,apparent_temperature,precipitation,relative_humidity_2m,wind_speed_10m&timezone=auto&temperature_unit=fahrenheit`

        const cityData = await this.#fetchData(baseURL);
        return cityData;
        
    }

    async #fetchData(baseURL){
        
        try {
            const response = await fetch(baseURL);
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.log(error);
        }
    }

};

const weather = new WeatherApi();

window.addEventListener("DOMContentLoaded", async() =>{
    const defaultCity = "chicago";
    initiazation(defaultCity);

})

async function initiazation(savedCity) {
    try {
        apiData = await weather.getCity(savedCity);
        cityApiData = await weather.nameCity(savedCity);
        city.textContent = `${cityApiData.city}, ${cityApiData.country}`;
        data.textContent = formattingDate(apiData.current.time);
        temperature.textContent = `${Math.ceil(apiData.current.temperature_2m)}°`;
        feelsLike.textContent =  `${apiData.current.apparent_temperature}°`;
        humidity.textContent = `${apiData.current.relative_humidity_2m}%`;
        wind.textContent = `${apiData.current.wind_speed_10m} Km/h `;
        precipitation.textContent = `${apiData.current.precipitation} mm`;
        elemDays.map( (elem, index) =>{
            elem.textContent = formattingDate(apiData.daily.time[index], true);
    
        });
        elemDayImgs.map( (elem, index) =>{
            elem.src = setImg(apiData.daily.weather_code[index]);
            
        });
        elemMinGrade.map((elem, index) =>{
            elem.textContent = `${Math.ceil(apiData.daily.temperature_2m_min[index])}°`;
        });
        elemMaxGrade.map((elem, index) =>{
            elem.textContent = `${Math.ceil(apiData.daily.temperature_2m_max[index])}°`;
        });
    
        const horaActual = await getHour(apiData.current.time, apiData.timeZone);
        let initialValue = horaActual;
        elemHourForecast.map((elem, index) =>{
            const apiIndex = initialValue + index;
            let value = `${getHour(apiData.hourly.time[apiIndex], apiData.timeZone)}`;
            elem.textContent = formatHour(value);
        });
    
        elemHourImg.map((elem, index) =>{
            const apiIndex = initialValue + index;
            elem.src = setImg(apiData.hourly.weather_code[apiIndex]);
        });
    
        elemHourGrade.map((elem,index) =>{
            const apiIndex = initialValue + index;
            elem.textContent = `${Math.ceil(apiData.hourly.temperature_2m[apiIndex])}°`;
        });
        loadingState.forEach(elem =>{
            elem.classList.remove("loading-state");
        })
     
        
    } catch (error) {
        console.log(error);
    }
    
}

let cityInput = document.getElementById("cityInput");
let saveBtn = document.getElementById("saveBtn");
let city = document.getElementById("city");
let data = document.getElementById("date");
let temperature = document.getElementById("temperature");
let feelsLike = document.getElementById("feels-like");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let precipitation = document.getElementById("precipitation");
let days = document.querySelectorAll(".day");
let dayImgs = document.querySelectorAll(".data-card-daily img");
const elemDayImgs = Array.from(dayImgs);
const elemDays = Array.from(days);
const minGrade = document.querySelectorAll(".min-grade");
const maxGrade = document.querySelectorAll(".max-grade");
const hourForecast = document.querySelectorAll(".hour");
const hourImg = document.querySelectorAll(".hourly-block img");
const hourGrade = document.querySelectorAll(".hour-grade");
const loadingState = document.querySelectorAll(".loading-state");

const elemHourGrade = Array.from(hourGrade);
const elemHourImg = Array.from(hourImg);
const elemHourForecast = Array.from(hourForecast);
const elemMinGrade = Array.from(minGrade);
const elemMaxGrade = Array.from(maxGrade);

// make suggestion input

saveBtn.addEventListener("click", async () =>{
    const savedCity = cityInput.value ;
    initiazation(savedCity);

});

function getHour(raw, timeZone){
    const date =  new Date(raw);
    const option = {hour:"numeric",
        timeZone: timeZone,
        hourCycle: "h23",
    }
    const hour = date.toLocaleTimeString("en-US", option);
    return parseInt(hour, 10);
}

function formatHour(number){
    const suffix = number >=12 ?"PM":"AM";
    let hour = number % 12;
    if( hour === 0 ) hour = 12;
    return `${hour} ${suffix}`;
}

function formattingDate(raw, onlyDay = false){
    if(onlyDay){
        const date = new Date(raw.substring(0,10) + "T12:00:00Z");
        return date.toLocaleDateString("en-US",{weekday:"short",
            timeZone: "UTC",
        });
    }else {
        const date = new Date(raw + ":00Z");
        const options = {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone:"UTC",
        };
    
        return date.toLocaleDateString("en-US", options);
    }
}

function setImg(index) {
    const options = [
        "./assets/images/icon-overcast.webp",     // 0
        "./assets/images/icon-drizzle.webp",      // 1
        "./assets/images/icon-fog.webp",          // 2
        "./assets/images/icon-partly-cloudy.webp", // 3
        "./assets/images/icon-rain.webp",         // 4
        "./assets/images/icon-snow.webp",         // 5
        "./assets/images/icon-storm.webp",        // 6
        "./assets/images/icon-sunny.webp"         // 7
    ];

    let icon;

    switch(index) {
        case 0:  // Clear / Sunny
            icon = options[7];
            break;
        case 1:  // Partly cloudy
            icon = options[3];
            break;
        case 2:  // Overcast
            icon = options[0];
            break;
        case 3:  // Drizzle
            icon = options[1];
            break;
        case 4:  // Fog
            icon = options[2];
            break;
        case 5:  // Rain
            icon = options[4];
            break;
        case 6:  // Snow
            icon = options[5];
            break;
        case 7:  // Storm
            icon = options[6];
            break;
        default: // Fallback
            icon = options[0];
    }

    return icon;
};


