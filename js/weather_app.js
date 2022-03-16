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

}).done(function(data) {
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

// creates the weather tables based on location
        }).done(function(data) {
            $("#forecast").html(createWeatherTables(data));
            displayCityData(marker._lngLat.lat, marker._lngLat.lng);
        });
    });
});





// ========== Create Weather Tables Function ==========
// creates weather cards and displays them to the dom
function createWeatherTables(data) {
    let html = '';

// creates 5 duplicate cards with different data populated by the API
    for (let i = 0; i < 5; i++) {

// takes in date data in the API and displays it in a more readable format
        let date = new Date(data.daily[i].dt * 1000).toDateString();

        html += `<div class="weather-cards">
                            <h5 id="date">${date}</h5>
                            <img src="http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png">
                            <p id="temp">${data.daily[i].feels_like.day}&#176</p>
                            <p>High: ${data.daily[i].temp.max}&#176</p>
                            <p>Low: ${data.daily[i].temp.min}&#176</p>
                    </div>`
    }
    return html;
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

    }).done(function(data) {
        $("#forecast").html(createWeatherTables(data));
        displayCityData(marker._lngLat.lat, marker._lngLat.lng);
    })
})


function displayCityData(lat, lng){
    reverseGeocode({lat, lng}, MAPBOX_API_TOKEN).then(function(results) {
        $("#current-city").html(results)
    })
}