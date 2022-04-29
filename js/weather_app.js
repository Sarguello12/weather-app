"use strict";

// ========== Initial Page Data ==========
// initial declaration of map location (San Antonio, TX)
let lat = 29.423017;
let long = -98.48527;

// gets initial data from the API to populate the page
$.get("https://api.openweathermap.org/data/2.5/onecall?", {
    APPID: OPEN_WEATHER_API_TOKEN,
    lat:    lat,
    lon:   long,
    units: "imperial"
// on data population display weather detail and forecast cards
}).done(function(data) {
    $("#details").html(createDetailCard(data));
    $("#forecast").html(createWeatherTables(data));
});

// creates and displays the map on the page
mapboxgl.accessToken = MAPBOX_API_TOKEN;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-98.491142, 29.424349], // starting position [lng, lat]
    zoom: 10 // starting zoom
});


// ========== Search Functionality ==========
// button on click sets location based on the city entered within the input tag
$("button").click(function() {
// geocode function takes in input from search bar and moves map to city location and updates lat/long
    geocode($("#location").val(), MAPBOX_API_TOKEN).then(function (result) {
        map.setCenter(result);
        map.setZoom(10);
        lat = result[1];
        long = result[0];

// sets marker to the location specified in the input tag
        marker.setLngLat([long, lat])

// pulls data based on the location specified
        $.get("https://api.openweathermap.org/data/2.5/onecall?", {
            APPID: OPEN_WEATHER_API_TOKEN,
            lat:    lat,
            lon:   long,
            units: "imperial"

// creates the details and forecast tables based on location and displays marker on location
        }).done(function(data) {
            $("#forecast").html(createWeatherTables(data));
            $("#details").html(createDetailCard(data));
            displayCityData(marker._lngLat.lat, marker._lngLat.lng);
        });
    });
});





// ========== Functions ==========
// function displays detailed weather info card on page
function createDetailCard(data){
    let html = '';

    let date = new Date(data.current.dt * 1000).toDateString();
    let time = new Date(data.current.dt * 1000).toTimeString();
    let sunRise = new Date(data.current.sunrise * 1000).toLocaleTimeString();
    let sunSet = new Date(data.current.sunset * 1000).toLocaleTimeString();

    html += `<div class="detail-card">   
                <h3>${date}</h3>
                <h5>${time}</h5>
                <img id="daily-img" src="http://openweathermap.org/img/w/${data.current.weather[0].icon}.png">
                <p class="temp">${data.current.feels_like}&#176</p>
                <p class="details">${data.current.weather[0].description}</p>
                    <hr>
                <table>
                    <tr>
                        <td>Todays High: ${data.daily[0].temp.max}&#176</td>
                        <td>Todays Low: ${data.daily[0].temp.min}&#176</td>
                    </tr>
                    <tr>
                        <td>Sunrise: ${sunRise}</td>
                        <td>Sunset: ${sunSet}</td>
                    </tr>
                    <tr>
                        <td>Wind Direction: ${windCardinalDirection(data.current.wind_deg)}</td>
                        <td>Wind Speed: ${data.current.wind_speed}mph</td>
                    </tr>
                    <tr>
                        <td>Humidity: ${data.current.humidity}%</td>
                        <td>UV Index: ${data.current.uvi}</td>
                    </tr>
                </table>
            </div>`

    return html;
}

// creates 5-day forecast cards and displays them on the page
function createWeatherTables(data) {
    let html = '';
// creates 5 duplicate cards with different data populated by the API
    for (let i = 0; i < 5; i++) {
// takes in date data in the API and displays it in a more readable format
        let date = new Date(data.daily[i].dt * 1000).toDateString();

        html += `<div class="weather-cards">
                            <h5 id="date">${date}</h5>
                            <img src="http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png">
                            <p class="temp">${data.daily[i].feels_like.day}&#176</p>
                            <p>High: ${data.daily[i].temp.max}&#176</p>
                            <p>Low: ${data.daily[i].temp.min}&#176</p>
                    </div>`
    }
    return html;
}

// function takes in the wind direction(in degrees) and converts them to a directional output
function windCardinalDirection(degrees){
    let cardinalDirection = '';
    if ((degrees > 348.75 && degrees <= 360) || (degrees >=0 && degrees <= 11.25)){
        cardinalDirection = "N";
    } else if (degrees > 11.25 && degrees  <= 33.75) {
        cardinalDirection = "NNE";
    } else if (degrees > 33.75 && degrees <= 56.25) {
        cardinalDirection = "NE";
    } else if (degrees > 56.25 && degrees <= 78.75) {
        cardinalDirection = "ENE";
    } else if (degrees > 78.75 && degrees <= 101.25) {
        cardinalDirection = "E";
    } else if (degrees > 101.25 && degrees <= 123.75) {
        cardinalDirection = "ESE";
    } else if (degrees > 123.75 && degrees <= 146.25) {
        cardinalDirection = "SE";
    } else if (degrees > 146.25 && degrees <= 168.75) {
        cardinalDirection = "SSE";
    } else if (degrees > 168.75 && degrees <= 191.25) {
        cardinalDirection = "S";
    } else  if (degrees > 191.25 && degrees <= 213.75) {
        cardinalDirection = "SSW";
    } else if (degrees > 213.75 && degrees <= 236.25)  {
        cardinalDirection = "SW";
    } else if (degrees > 236.25 && degrees <= 258.75) {
        cardinalDirection = "WSW";
    } else if (degrees > 258.75 && degrees <= 281.25) {
        cardinalDirection = "W";
    } else if (degrees > 281.25 && degrees <= 303.75) {
        cardinalDirection = "WNW";
    } else if (degrees > 303.75 && degrees <= 326.25) {
        cardinalDirection = "NW";
    } else if (degrees > 326.75 && degrees <= 348.75) {
        cardinalDirection = "NNW";
    }
    return cardinalDirection;
}

// takes in lat/lng and displays the address of wherever the marker is placed, originally will populate in San Antonio
function displayCityData(lat, lng){
    reverseGeocode({lat, lng}, MAPBOX_API_TOKEN).then(function(results) {
        $("#current-city").html(results)
        console.log(results)
    })
}


// ========== Map Marker ==========
// creates the marker
let marker = new mapboxgl.Marker()
    .setLngLat([long, lat])
    .addTo(map)
    .setDraggable(true);

// when marker is released weather data in the cards is updated
marker.on("dragend", function(){
    $.get("https://api.openweathermap.org/data/2.5/onecall?", {
        APPID: OPEN_WEATHER_API_TOKEN,
        lat:   marker._lngLat.lat,
        lon:   marker._lngLat.lng,
        units: "imperial"
// once data is loaded it is displayed in the details and forecast cards
    }).done(function(data) {
        $("#details").html(createDetailCard(data));
        $("#forecast").html(createWeatherTables(data));
        displayCityData(marker._lngLat.lat, marker._lngLat.lng);
    })
})