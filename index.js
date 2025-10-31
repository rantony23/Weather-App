class WeatherApi{
    #baseURL = "http://api.weatherapi.com/v1";
    #apiKey = "b6ed63ec4e6b4278870225736251910";
    #endpoints = {
        current:`current.json`,
        forecast:'forecast.json',
        search:`search.json`,
    }

    async #fetchData(endpoint,city, days){
        try {
            let url = `${this.#baseURL}/${endpoint}?key=${this.#apiKey}&q=${city}`;
            if( days) url += `&days=${days}`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.log(error);
        }
    }

    async getCurrentWeather(city){
        return this.#fetchData(this.#endpoints.current, city);
    };

    async getForecastWeather(city, days = 7){
        return this.#fetchData(this.#endpoints.forecast, city, days);
    }

    async SearchCity(city){
        return this.#fetchData(this.#endpoints.search, city);
    }
};

const weather = new WeatherApi();
weather.getCurrentWeather("bogota")
    .then(data => console.log(data)).catch(err => console.error(err));

let cityInput = document.getElementById("cityInput");
let saveBtn = document.getElementById("saveBtn");
let city = document.getElementById("city");
let data = document.getElementById("date");
let temperature = document.getElementById("temperature");

// make suggestion input

saveBtn.addEventListener("click", () =>{
    const savedCity = cityInput.value ;
    city.textContent = savedCity;
})