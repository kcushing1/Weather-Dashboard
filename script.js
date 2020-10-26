//vars to define can go here

//click event listener for search button
$(".search-btn").on("click", searchCity)
//optional: only let btn work if there is a city listed

//requesting the city info from OpenWeather API
function searchCity(){

  //clear card

     //queryURL template for OpenWeather API
     let city = $(".search-city").val()
     let queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+ city + "&units=imperial&appid=349bd553f59e26c071b517009066832a";
     let forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city +"&units=imperial&appid=349bd553f59e26c071b517009066832a";
     let todayLong = moment().format("LL")
     let today = moment()

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
       $(".current-city").html(`<h3> ${cityName} ${todayLong} icon </h3>`)

       //add temp 
       let cityTemp = results.temp
       //((results.temp - 273.15) * 1.8 + 32).toFixed(1)
       $(".current-temp").text(`Temperature: ${cityTemp} **F`)
       // add humidity
       let cityHumidity = results.humidity
       $(".current-humidity").text(`Humidity: ${cityHumidity}%`)
       // add wind speed
       let cityWind = response.wind.speed
       $(".current-wind").text(`Wind Speed: ${cityWind} mph`)
       //uv index...can't locate?

     }); //end ajax current

     cityForecast()

     function cityForecast(){
      $.ajax({
        url: forecastURL,
        method: "GET"
      }).then(function(future) {
        console.log(future)
        //time is 3hr incr for 5 days
        //need to check time for 12:00:00 in str
        //future.list[i].dt_txt is 
        //str "2020-10-27 12:00:00
        let futureArray = []
        
        getNoontime()

        //take only the days at noontime to ensure no repeat days
        function getNoontime(){
          for (let i=0; i<future.list.length; i++){
            let checkFutureTime = future.list[i].dt_txt
            let noontime = "12:00:00"

            //if the time is noon and the day is not today
            //add that i to futureArray
            if (checkFutureTime.includes(noontime) && checkFutureTime !== today){
              console.log("checkfuturetime is connected")
              futureArray.push(i)
            }
          }
          console.log(futureArray)
        }

        addForecastCards()

        function addForecastCards(){
          for (let j=0; j<futureArray.length; j++){
           let forecastDay = future.list[j]
           let displayForecastDate = moment(forecastDay.dt_txt).format("l")
           //icon
           let displayForecastTemp = future.list[j].main.temp
           let displayForecastHumidity = future.list[j].main.humidity

           console.log("forloop j is connected")
          
           $(".card-holder").append(`
            <div class="col card">
              <div class="card-body">
                <h6 class="card-title"> ${displayForecastDate} </h6>
                <p> icon </p>
                <p> ${displayForecastTemp} *F</p>
                <p> ${displayForecastHumidity}% </p>
              </div>
            </div>
           `)
           console.log(".card-holder is connected")
          }
          console.log("addforecastcards is connected")
        }
        
        //icon .weather[0].main = "clouds"
        //if statement for chosing icon?
        //Clouds, Rain
         

     //prev cities searched
     //log as buttons? cards?
      }) //end forecast ajax
     } //end cityForecast()
     

  console.log("search btn connected")
}


//prev-city search click event...maybe?