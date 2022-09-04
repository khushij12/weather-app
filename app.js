const notificationElement=document.querySelector(".notification");
const iconElement=document.querySelector(".weather-icon");
const tempElement=document.querySelector(".temperature-value p");
const descElement=document.querySelector(".temperature-description p");
const locElement=document.querySelector(".location p");

//app obj
const weather={};

//temp var
weather.temperature={
    unit:"celsius"
}

const KELVIN=273;
//API key
const key="7c191a48e159f2626bb5994ecfd6b728";

//check if browser supports geolocation
// The navigator object contains information about the browser.
// property: browser_name,browser_version,geolocator,isonline,codename,iscookiesEnabled etc.
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition,showError);
}
else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML="<p>Browser doesn't Support Geolocation</p>";
}


//set users position

function setPosition(position){
    let latitude=position.coords.latitude;
    let longitude=position.coords.longitude;

    getWeather(latitude,longitude);
}

//show error when there is an issue with geolocation service
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML=`<p>${error.message}</p>`;
}
//get weather from api
function getWeather(latitude,longitude){
    let api=`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    //  console.log(api);

    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });


}

// display weather to ui
function displayWeather(){
    iconElement.innerHTML=`<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML=`${weather.temperature.value}<sup>o</sup><span>C</span>`;
    descElement.innerHTM=weather.description;
    locElement.innerHTML=`${weather.city},${weather.country}`;
}

//C to f conversion
function celsiusToFahr(temperature){
    return (temperature*9/5)+32;
}

//when the user clicks
tempElement.addEventListener("click",function(){
    if(weather.temperature.value===undefined) return;
    
    if(weather.temperature.unit === "celsius"){
        let fahrenheit=celsiusToFahr(weather.temperature.value);
        fahrenheit=Math.floor(fahrenheit);

        tempElement.innerHTML=`${fahrenheit}<sup>o</sup><span>F</span>`;
        weather.temperature.unit="fahrenheit";
    }
    else{
        tempElement.innerHTML=`${weather.temperature.value}o<span>C</span>`;
        weather.temperature.unit="celsius";
    }
})