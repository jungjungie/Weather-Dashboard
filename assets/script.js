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