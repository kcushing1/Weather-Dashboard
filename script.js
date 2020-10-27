//vars to define can go here
let listSearchCities = []

//click event listener for search button
$(".search-btn").on("click", searchCity)
//optional: only let btn work if there is a city listed

//requesting the city info from OpenWeather API
function searchCity(){

  //remove welcome card and show city card
    $(".city-card").removeClass("hidden")
    $(".welcome-card").addClass("hidden")
 
    //clear card
    removeForecastCards()

     let city = $(".search-city").val()
     let queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+ city + "&units=imperial&appid=349bd553f59e26c071b517009066832a";
     let forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city +"&units=imperial&appid=349bd553f59e26c071b517009066832a";

     let todayLong = moment().format("LL")
     let today = moment()

     //add newly searched city to list for storage
     listSearchCities.push(city)

     //limit the previous search list to 5 cities
     if (listSearchCities.length > 5){
       listSearchCities.splice(0)
     }

     //present weather request
     $.ajax({
       url: queryURL,
       method: "GET"
     }).then(function(response) {
       console.log(response);
       let results = response.main
       let cityName = response.name
       let cityIcon = response.weather[0].icon
       let cityIconURL = "http://openweathermap.org/img/wn/"+ cityIcon +"@2x.png"

       //add city name as header with date & icon
       $(".current-city").html(`<h3> ${cityName} - ${todayLong} 
       <img id="icon" alt="Weather Icon" src=${cityIconURL}>
       </h3>`)

       //add temp 
       let cityTemp = results.temp.toFixed(1)
       $(".current-temp").text(`Temperature: ${cityTemp} ˚F`)
       // add humidity
       let cityHumidity = results.humidity
       $(".current-humidity").text(`Humidity: ${cityHumidity}%`)
       // add wind speed
       let cityWind = response.wind.speed
       $(".current-wind").text(`Wind Speed: ${cityWind} mph`)

       cityUV()
      //need to use fist ajax response to get coords
      //need coords to get UV, can't do by city name
       function cityUV(){
        let cityLat = response.coord.lat
        let cityLon = response.coord.lon
        let ultraVURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=349bd553f59e26c071b517009066832a"
  
          $.ajax({
            url: ultraVURL,
            method: "GET"
          }).then(function(UV) {
            console.log(UV)
            uvIndex = UV.value
            $(".current-uv").html(`<p>UV Index: 
            <span class="uv rounded">${uvIndex}<span>
            </p>`)
            colorUVIndex()

            //indicate index severity by color
            function colorUVIndex(){
              if (uvIndex < 3){
                $(".uv").addClass("low-uv")
              } else if (uvIndex >= 3 || uvIndex < 6){
                 $(".uv").addClass("mod-uv")
              } else if (uvIndex >= 6 || uvIndex <8){
                $(".uv").addClass("high-uv")
              } else if (uvIndex >= 8 || uvIndex < 10){
                $(".uv").addClass("very-high-uv")
              } else {
                $(".uv").addClass("extreme-uv")
              }
            }
          })//end UV ajax
        } //end cityUV ftn

     })//end ajax current


     cityForecast()

     //send for OpenWeather API for forecasted weather
     //returns forecast in 3hr increments for 5 days
     function cityForecast(){
      $.ajax({
        url: forecastURL,
        method: "GET"
      }).then(function(future) {
        console.log(future)

        //make array to capture relevent points in API object response
        let futureArray = []
        
        getNoontime()

        //take only the days at noontime to ensure no repeat days
        function getNoontime(){
          for (let i=0; i<future.list.length; i++){
            let checkFutureTime = future.list[i].dt_txt
            let noontime = "12:00:00"

            //if the time is noon and the day is not today
            //check if string noontime is present
            //add that i value to futureArray
            if (checkFutureTime.includes(noontime) && checkFutureTime !== today){
              futureArray.push(i)
            }
          }
          console.log(futureArray)
        }

        //add the forecast below the present weather
        addForecastCards()

        function addForecastCards(){
          let tomorrow = moment().add(1,"day")

          //create forecast card for each day
          for (let j=0; j<futureArray.length; j++){
           //icon
           let displayForecastTemp = future.list[j].main.temp.toFixed(1)
           let displayForecastHumidity = future.list[j].main.humidity
           let forecastIcon = future.list[j].weather[0].icon
           let forecastIconURL = "http://openweathermap.org/img/wn/"+ forecastIcon +".png"
          
           //create the card with title, icon, temp, hum.
           $(".forecast-cards").append(`
            <div class="col card rounded">
              <div class="card-body p-0">
                <h6 class="card-title">${tomorrow.format("l")}</h6>
                <img class="icon" alt="Weather Icon" src=${forecastIconURL}>
                <p> ${displayForecastTemp} ˚F</p>
                <p> Hum. ${displayForecastHumidity}% </p>
              </div>
            </div>
           `);

            //add a day to the display date for the next card
            tomorrow.add(1,"day")
          }
          console.log("addforecastcards is connected")
        }
  
        //icon .weather[0].main = "clouds"
        //if statement for chosing icon?
        //Clouds, Rain
    
      }) //end forecast ajax
     } //end cityForecast()  
     
     function removeForecastCards(){
       $(".forecast-cards").empty()
     }

  savePreviousCities()
//save cities to localstorage
function savePreviousCities(){
  for (let k=0; k< listSearchCities.length; k++){
    localStorage.setItem("searchCity"+k, listSearchCities[k])
  }
}

  $(".search-city").val("")
  console.log("search btn connected")
}//end search btn


listPreviousCities()
//post the city to the previously searched list aside
function listPreviousCities(){
  for (let k=0; k< listSearchCities.length; k++){
    $(".prev-city"+k).text(localStorage.getItem("searchCity"+k))
  }
}

//prev-city search click event...maybe?
//add event, in function(){
  // set $(".search-city").val($this) or something
