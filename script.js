//vars to define can go here

//click event listener for search button
$(".search-btn").on("click", searchCity)
//optional: only let btn work if there is a city listed

//requesting the city info from OpenWeather API
function searchCity(){

  //clear card

     //queryURL template for OpenWeather API
     const myKey = "349bd553f59e26c071b517009066832a"
     let city = $(".search-city").val()
     let queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+ city + "&appid=" + myKey;

     console.log(city)

     $.ajax({
       url: queryURL,
       method: "GET"
     }).then(function(response) {
       console.log(response);
       let results = response.main
       //city (date) + icon
       let cityName = response.name
       //let cityIcon = response.weather[0].icon

       //add city name as header with date & icon
       $(".current-city").html(`<h3> ${cityName} date icon </h3>`)

       //temp
       let cityTemp = ((results.temp - 273.15) * 1.8 + 32).toFixed(1)
       $(".current-temp").text(`Temperature: ${cityTemp} **F`)
       //humidity
       let cityHumidity = results.humidity
       $(".current-humidity").text(`Humidity: ${cityHumidity}%`)
       //wind speed
       let cityWind = response.wind.speed
       $(".current-wind").text(`Wind Speed: ${cityWind} mph`)
       //uv index...can't locate?

       //5-day forecast
       //date
       //icon
       //temp
       //humidity

       //prev cities searched
       //log as buttons
     });

  console.log("search btn connected")
}

//prev-city search click event...maybe?