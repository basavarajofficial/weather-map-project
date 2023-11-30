let long;
let lat;
let temeratureDescription = document.querySelector(".temerature-description");
let temperatureDegree = document.querySelector(".temperature-degree");
let locationTimezone = document.querySelector(".location-timezone");
let setIcon = document.querySelector(".icon");
let maxTemp = document.querySelector(".maxTemp");
let minTemp = document.querySelector(".minTemp");
let windspeed = document.querySelector(".windspeed");
let weather = document.querySelector("#weather");


if (navigator.geolocation) {
// console.log(navigator.geolocation);

  navigator.geolocation.getCurrentPosition(async (position) => {      
    // console.log(position);
    lat = position.coords.latitude;
    long = position.coords.longitude;

    const data = await getWeatherData(lat, long);
    console.log("dddd:" , data);


    var map = L.map("map").setView([lat, long], 6);

    L.tileLayer("https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=i8MrNt8UayKKkFvnEviY",
      {
        maxZoom: 22,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    ).addTo(map);

    var marker = L.marker([lat, long]).addTo(map);

    console.log("marker");
   

    var circle = L.circle([lat, long], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 800,
    }).addTo(map);

    marker.bindPopup(`<b>${data.name}</b>`).openPopup();



    map.on("click", async function (e) {
      console.log(e.latlng.lat + " " + e.latlng.lng);

      const data = await getWeatherData(e.latlng.lat, e.latlng.lng);

      marker.setLatLng([e.latlng.lat, e.latlng.lng]);
      marker.bindPopup(`<b>${data.name}</b>`).openPopup();
      circle.setLatLng([e.latlng.lat, e.latlng.lng]);
      circle.bindPopup();
    
    });
  });
}

async function getWeatherData(lat, long) {
  

  const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=b8ef5d8cbca6753fb9c659635103c723`;

  let response = await fetch(api);
  let data = await response.json();

  weatherHandler(data);
  console.log("data: ", data);
  return data;
}


function weatherHandler (data){
    const {temp} = data.main;
    const {description } = data.weather[0];
    const {icon} =  data.weather[0];
    console.log(icon);
    const { temp_max} = data.main;
    const { temp_min} = data.main;
    const {speed} = data.wind;

    temperatureDegree.textContent = temp + '\xB0' + ' C';
    temeratureDescription.textContent = description;
    locationTimezone.textContent = data.name;
    maxTemp.textContent = "Max-Temp: " + temp_max + '\xB0' + ' C,';
    minTemp.textContent =  "Min-Temp: " + temp_min + '\xB0' + ' C';
    windspeed.textContent = "Wind Speed : "+ speed
    setIcon.style["background-image"] = `url(${setIconFunction(icon)})`

}

let setIconFunction = (icon) => {
    const icons = {
        "01d": "./animated/day.svg",
        "02d": "./animated/cloudy-day-1.svg",
        "03d": "./animated/cloudy-day-2.svg",
        "04d": "./animated/cloudy-day-3.svg",
        "09d": "./animated/rainy-1.svg",
        "10d": "./animated/rainy-2.svg",
        "11d": "./animated/rainy-3.svg",
        "13d": "./animated/snowy-6.svg",
        "50d": "./animated/mist.svg",
        "01n": "./animated/night.svg",
        "02n": "./animated/cloudy-night-1.svg",
        "03n": "./animated/cloudy-night-2.svg",
        "04n": "./animated/cloudy-night-3.svg",
        "09n": "./animated/rainy-1.svg",
        "10n": "./animated/rainy-2.svg",
        "11n": "./animated/rainy-3.svg",
        "13n": "./animated/snowy-6.svg",
        "50n": "./animated/mist.svg"
    };

    return icons[icon];
}
