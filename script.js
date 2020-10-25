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
       let cityName = reponse.name
       let cityIcon = response.weather[0].icon
       //temp
       let cityTemp = (results.temp - 273.15) * 1.8 + 32
       //humidity
       let cityHumidity = results.humidity
       //wind speed
       let cityWind = response.wind.speed
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