const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantLocation = document.querySelector(".grant-location-container");
const searchWeather = document.querySelector("[data-searchForm]");
const load = document.querySelector(".loading-container");
const errorPage = document.querySelector(".error-container");
const showWeather = document.querySelector(".user-info-container");



let currentTab = userTab;  //initialize variable since by default kahi na kahi toh hoga tab isliye currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"; //Define API keys
currentTab.classList.add("current-tab"); //adding css property with the help of js.
getsessionfromstorage();

function switchTab(clickedTab) {
    //first if condition is switching between tab. For example jo tab me pehle se hi hu wo tab ko chor ke koi aur tab me clicked krna tb yeh active hoga
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

    //search weather wale UI ko visible krwane ke liye grantaccess wale aur show weather wla screen invisible(remove) kr denge aur searchweather wale ko visible(add) kr denge.    
        if(!searchWeather.classList.contains("active")){
            grantLocation.classList.remove("active");
            showWeather.classList.remove("active");
            searchWeather.classList.add("active");
        }
        else{
            //main pehle search weather wale tab me tha ab your weather wala UI visible krna h
            searchWeather.classList.remove("active");
            showWeather.classList.remove("active");
            // your weather wale tab me show tbhi hoga jb uske local storage me coordinates saved honge . 
            //So for checking coordinates yeh function kaam krega local storage ko save rkhne me.
            getsessionfromstorage();
        }
    }
}

userTab.addEventListener("click",() => {
    switchTab(userTab); //pass clicked tab as input parameter
});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab); //pass clicked tab as input parameter
});


//check if coordinate are already present in the session or not
function getsessionfromstorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates saved nhi h tb grant location wala screen show krna hoga
        grantLocation.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon} = coordinates;
    //make grant-container invisible
    grantLocation.classList.remove("active");
    //make loader visible
    load.classList.add("active");

    //API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        load.classList.remove("active");
        showWeather.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        load.classList.remove("active");
        errorPage.classList.add("active");
    }
}

function renderWeatherInfo(WeatherInfo) {
    //fetch elements
    const cityname = document.querySelector("[cityname]")
    const countryIcon = document.querySelector("[dataCountryIcon]");
    const desc = document.querySelector("[data-weather-desc]");
    const Icon = document.querySelector("[descIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloud]");
    //fetch values and put in UI Elements
    cityname.innerText = WeatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${WeatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = WeatherInfo?.weather?.[0]?.description;
    Icon.src = `https://openweathermap.org/img/w/${WeatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${WeatherInfo?.main?.temp} ℃`;
    windspeed.innerText =`${WeatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${WeatherInfo?.main?.humidity}%`;
    clouds.innerText = `${WeatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No Geolocation support available");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

//grant-access button wale me apna location dena

const grantAccountaccess = document.querySelector("[data-GrantAccess]");
grantAccountaccess.addEventListener("click",getLocation);

const searchinput = document.querySelector("[data-inputWeather]");
searchWeather.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityname = searchinput.value;
    if(cityname===""){
        return;
        
    }
    else
        fetchsearchweatherinfo(cityname);
    
})

async  function fetchsearchweatherinfo(city){
    load.classList.add("active");
    showWeather.classList.remove("active");
    grantLocation.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        load.classList.remove("active");
        showWeather.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        load.classList.remove("active");
        showWeather.classList.remove("active");
        errorPage.classList.add("active");
    }

}
