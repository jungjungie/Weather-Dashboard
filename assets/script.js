var citiesArr = JSON.parse(localStorage.getItem("cities")) || [];
var clickedCity = "";

// Hide current & 5-day forecast if no cities searched
if(citiesArr[0] == undefined) {
    $("#datawrap").css("display", "none");
} 

function displayCurrentCity() {
    // Show current & 5-day forecast if there is a searched city
    if(citiesArr[0] !== undefined) {
        $("#datawrap").css("display", "block");
    }

    var city = citiesArr[0];
    // console.log(city);

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5&appid=16499f261adfaf628932819fce40e659",
        method: "GET"
    }).then(function(cityLatLong) {
        
        var lat = cityLatLong.city.coord.lat;
        var lon = cityLatLong.city.coord.lon;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=16499f261adfaf628932819fce40e659",
            method: "GET"
        }).then(function(weatherData) {
            // console.log(weatherData);

            var temp = (weatherData.current.temp - 273.15) * 1.80 + 32;
            var humidity = weatherData.current.humidity;
            var windSpd = weatherData.current.wind_speed;
            var uvIndexNum = weatherData.current.uvi;
            // console.log(`temp: ${temp}, humidity: ${humidity}, wind: ${windSpd}, uvIndex: ${uvIndexNum}`);

            function currentCityData() {
                var today = moment().format('LL');
                var icon = weatherData.current.weather[0].icon;
                icon = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png");

                // Display city & today's date
                $("#currentData").append($("<h3>").html(city + " (" + today + ")"));  
                $("#currentData").append(icon);

                // Display city's weather data
                temp = $("<p>").html("Temperature: " + temp.toFixed(2) + " &deg;" + "F")
                humidity = $("<p>").text("Humidity: " + humidity + "%");
                windSpd = $("<p>").text("Wind Speed: " + windSpd + " MPH");
                uvIndexTxt = $("<p>").text("UV Index: ");
                uvIndex = $("<span>").text(uvIndexNum);

                // UV Index color codes
                if (uvIndexNum >= 0 && uvIndexNum < 3) {
                    uvIndex.attr("class", "uv uvLow");
                } else if (uvIndexNum >= 3 && uvIndexNum < 6) {
                    uvIndex.attr("class", "uv uvModerate");
                } else if (uvIndexNum >= 6 && uvIndexNum < 8) {
                    uvIndex.attr("class", "uv uvHigh");
                } else {
                    uvIndex.attr("class", "uv uvVeryHigh");
                }

                $("#currentData").append(temp);
                $("#currentData").append(humidity);
                $("#currentData").append(windSpd);
                $("#currentData").append(uvIndexTxt);
                uvIndexTxt.append(uvIndex);
            }

            function fiveDayForecast() {
                var fiveDayArr = weatherData.daily;
                // Clear current 5-day dashboard
                $(".card-group").empty();

                for (var i=1; i < 6; i++) {
                    // console.log(fiveDayArr[i]);

                    // Dates
                    var unixtime = fiveDayArr[i].dt;
                    var fiveDays = moment.unix(unixtime).format("MM/DD/YYYY");
                    // var fiveDays = moment().add(i, 'days').format('l');  
                    fiveDays = $("<h6>").text(fiveDays);

                    // 5-Day Icons
                    var iconForecast = fiveDayArr[i].weather[0].icon;
                    iconForecast = $("<img>").attr({"src": "http://openweathermap.org/img/wn/" + iconForecast + "@2x.png", "width": "70px"});
                    var iconDiv = $("<div>").append(iconForecast);

                    // 5-Day Temps
                    var tempForecast = (fiveDayArr[i].temp.day - 273.15) * 1.80 + 32;
                    tempForecast = $("<p>").html("Temp: " + tempForecast.toFixed(2) + " &deg;" + "F");

                    // 5-Day Humidity
                    var humForecast = (fiveDayArr[i].humidity);
                    humForecast = $("<p>").text("Humidity: " + humForecast + "%");

                    // Appending data & elements
                    var card = $("<div>").attr("class", "card");
                    $(".card-group").append(card);
                    card.append(fiveDays, iconDiv, tempForecast, humForecast);
                }
            }
            currentCityData();
            fiveDayForecast();
        })    
    })
}
displayCurrentCity();

// Pulls up data of city searched
$("#srchBtn").on("click", function() {

    if ($("#cityInput").val() == "") {
        return;
    }

    // Saves searched cities to localStorage & keeps search history to 8 items
    citiesArr = JSON.parse(localStorage.getItem("cities")) || [];
    citiesArr.unshift($("#cityInput").val());
    if (citiesArr.length >= 9) {
        citiesArr.pop();
    }
    localStorage.setItem("cities", JSON.stringify(citiesArr));    

    // Adds searched cities to search history
    citiesArr = JSON.parse(localStorage.getItem("cities"));
    
    viewSrchHistory();

    // Clear current data & display new data
    $("#currentData").empty();
    displayCurrentCity();
})

function viewSrchHistory() {
    $("#srchHistory").empty();
    
    citiesArr = JSON.parse(localStorage.getItem("cities")) || [];

    for (var i=0; i < citiesArr.length; i++) {
        $("#srchHistory").append($("<li>").text(citiesArr[i]).attr("class", "list-group-item"));
    }
}
viewSrchHistory();

// Pulls up data of city clicked in search history
$(document).on("click", "li", function() {
    citiesArr = JSON.parse(localStorage.getItem("cities")) || [];
    citiesArr.unshift($(this).text());
    if (citiesArr.length >= 9) {
        citiesArr.pop();
    }
    localStorage.setItem("cities", JSON.stringify(citiesArr));    

    // Adds searched cities to search history
    citiesArr = JSON.parse(localStorage.getItem("cities"));

    viewSrchHistory();

    // Clear current data & display new data
    $("#currentData").empty();
    displayCurrentCity();
})