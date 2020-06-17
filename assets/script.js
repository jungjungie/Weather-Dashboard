var citiesArr = JSON.parse(localStorage.getItem("cities")) || [];

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
            var uvIndex = weatherData.current.uvi;
            console.log(`temp: ${temp}, humidity: ${humidity}, wind: ${windSpd}, uvIndex: ${uvIndex}`);

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
                uvIndex = $("<span>").text(uvIndex);

                // UV Index color codes
                if (uvIndex >= 0 && uvIndex < 3) {
                    uvIndex.attr("class", "uv uvLow");
                } else if (uvIndex >= 3 && uvIndex < 6) {
                    uvIndex.attr("class", "uv uvModerate");
                } else if (uvIndex >= 6 && uvIndex < 8) {
                    uvIndex.attr("class", "uv uvHigh");
                } else {
                    // uvIndex.css("background", "red");
                    uvIndex.attr("class", "uv uvVeryHigh");
                }

                $("#currentData").append(temp);
                $("#currentData").append(humidity);
                $("#currentData").append(windSpd);
                $("#currentData").append(uvIndexTxt);
                uvIndexTxt.append(uvIndex);
            }
            currentCityData();
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