    var inputEl = document.querySelector("#city-input");
    var searchEl = document.querySelector("#search-button");
    var nameEl = document.querySelector("#city-name");
    var currentPicEl = document.querySelector("#current-pic");
    var currentTempEl = document.querySelector("#temperature");
    var currentHumidityEl = document.querySelector("#humidity");
    var currentWindEl = document.querySelector("#wind-speed");
    var currentUVEl = document.querySelector("#UV-index");
    var historyEl = document.querySelector("#history");
    var currentDate = moment().format("MMMM Do");
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    var APIKey = "b0d5c515fc9c301e38363d3002468166";


    function getWeather(cityName) {

   
        
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + APIKey;
        fetch(queryURL)

        .then(response => response.json())
        .then(data => {
            nameEl.innerHTML = data.name + " " + currentDate;
            let weatherPic = data.weather[0].icon;
            currentPicEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            currentPicEl.setAttribute("alt", data.weather[0].description);
            currentTempEl.innerHTML = "Temperature: " + data.main.temp;
            currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
            currentWindEl.innerHTML = "Wind Speed: " + data.wind.speed + " MPH";

        });

        let lat = data.coord.lat;
        let lon = data.coord.lon;
      
        var UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        
        fetch(UVQueryURL)
        
        .then(response => response.json())
        .then(data => {
            let UVIndex = document.createElement("span");
            UVIndex.setAttribute("class","badge badge-success");
            UVIndex.innerHTML = data[0].value;
            currentUVEl.innerHTML = "UV Index:";
            currentUVEl.append(UVIndex);
        

        
        });

        let cityID = data.id;
        
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&units=imperial" + "&appid=" + APIKey;
        fetch(forecastQueryURL)
        
        .then(response => response.json())
        .then(data => {
           var forecastEls = document.querySelectorAll(".forecast");
           for (i=0; i<forecastEls.length; i++) {
           forecastEls[i].innerHTML = "";     
           var forecastIndex = i*8 + 4;
           var forecastDate = new Date(data.list[forecastIndex].dt * 1000);
           var forecastDay = forecastDate.getDate();
           var forecastMonth = forecastDate.getMonth() + 1;
           var forecastYear = forecastDate.getFullYear();
           var forecastDateEl = document.createElement("p");
           forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
           forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
           forecastEls[i].append(forecastDateEl);
           var forecastWeatherEl = document.createElement("img");
           forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
           forecastWeatherEl.setAttribute("alt",data.list[forecastIndex].weather[0].description);
           forecastEls[i].append(forecastWeatherEl);
           var forecastTempEl = document.createElement("p");
           forecastTempEl.innerHTML = "Temp: " + data.list[forecastIndex].main.temp;
           forecastEls[i].append(forecastTempEl);
           var forecastHumidityEl = document.createElement("p");
           forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
           forecastEls[i].append(forecastHumidityEl);
           }
        });
    };

        searchEl.addEventListener("click",function() {
        var searchTerm = inputEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();
        });

        function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i=0; i<searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
            historyItem.setAttribute("type","text");
            historyItem.setAttribute("readonly",true);
            historyItem.setAttribute("class", "form-control d-block text-light bg-dark");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click",function() {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        };

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    };
