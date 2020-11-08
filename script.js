let today = moment()
let todayLong = moment().format("LL")

//get prev searched cities from storage, convert to array
//if nothing in storage, use empty array
let listSearchCities = JSON.parse(localStorage.getItem("prevSearchCities")) || []

//click event listener for search button
$(".search-btn").on("click", searchCity)

//load previous city onto display
loadPreviousCity()
removeForecastCards()

function loadPreviousCity(){
  removeForecastCards()
  currentWeather()
  listPreviousCities()
}

//search for a city when the search button is clicked
function searchCity(){
  //add the new city to the search city array
  let addCity = $(".search-city").val()
    listSearchCities.push(addCity)

  //keep the cities list max length 6, remove older city
  if (listSearchCities.length > 6){
    listSearchCities.shift()
  }

  //clear forecasts posted for previous city
  removeForecastCards()

  //get current weather and forecast for searched city
  currentWeather()
  cityForecast()
  listPreviousCities()
}

  function currentWeather(){
    //let city be most recently searched city
    let city = listSearchCities[listSearchCities.length-1]

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ city + "&units=imperial&appid=349bd553f59e26c071b517009066832a";

     //current city weather request
     $.ajax({
       url: queryURL,
       method: "GET"
     }).then(function(response) {
      //store response pieces as variables
       let results = response.main
       let cityName = response.name
       let cityIcon = response.weather[0].icon
       let cityIconURL = "https://openweathermap.org/img/wn/"+ cityIcon +"@2x.png"

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
         //get coordinates for city to use in API
        let cityLat = response.coord.lat
        let cityLon = response.coord.lon
        let ultraVURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=349bd553f59e26c071b517009066832a"
  
          $.ajax({
            url: ultraVURL,
            method: "GET"
          }).then(function(UV) {
             uvIndex = UV.value

             //add UV value and severity color
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
        } //end cityUV function

     })//end ajax current city weather

     if (listSearchCities.length > 6){
      listSearchCities.shift()
    }

    //store the cities array as a string
    localStorage.setItem("prevSearchCities",JSON.stringify(listSearchCities))

    }//end currentWeather function


    cityForecast()

     //send for OpenWeather API for forecasted weather
     //returns forecast in 3hr increments for 5 days
     function cityForecast(){
      let city = listSearchCities[listSearchCities.length-1]
      let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city +"&units=imperial&appid=349bd553f59e26c071b517009066832a";

      $.ajax({
        url: forecastURL,
        method: "GET"
      }).then(function(future) {

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
        }//end getNoontime function

        //add the forecast below the present weather
        addForecastCards()

        function addForecastCards(){
          //tomorrow is one day more than today
          let tomorrow = moment().add(1,"day")

          //create forecast card for each day
          for (let j=0; j<futureArray.length; j++){
           //temp
           let displayForecastTemp = future.list[j].main.temp.toFixed(1)
           //hum.
           let displayForecastHumidity = future.list[j].main.humidity
           //icon
           let forecastIcon = future.list[j].weather[0].icon
           let forecastIconURL = "https://openweathermap.org/img/wn/"+ forecastIcon +".png"
          
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

            //add a day to the display date for the next day card
            tomorrow.add(1,"day")
          }
        }//end addForecastCards function
    
      }) //end forecast ajax
     } //end cityForecast function 
     
     //clear the forcast cards before appending new ones
     function removeForecastCards(){
       $(".forecast-cards").empty()
     }

     //clear the listed cities before appending new ones
     function removeListedCities(){
       $(".prev").empty()
     }

  //post the city to the previously searched list aside
  function listPreviousCities(){
    removeListedCities()

    //get from storage the cities array
    let listSearchCities = JSON.parse(localStorage.getItem("prevSearchCities"))

    //list prev cities from array on buttons, decending order
    for (let k=listSearchCities.length - 1; k >= 0; k--){
      $("#prevcity" + k).append(listSearchCities[k])
    }
  }

  //when prev city button clicked, pull up that city
$(".prev").on("click",function(){
  let reviewCity = $(this).text()

  //add the city to array, so it can be accessed by other functions
  listSearchCities.push(reviewCity)
  if (listSearchCities.length > 6){
    listSearchCities.shift()
  }

  removeForecastCards()

  //get current weather and forecast for searched city
  currentWeather()
  cityForecast()
  listPreviousCities()
})

