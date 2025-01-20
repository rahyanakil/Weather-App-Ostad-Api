const emptyInput = document.getElementById("empty-input")
const searchBtn = document.getElementById("search-button")

document.getElementById("search-city").addEventListener("keypress",(event)=> {
    if(event.key==="Enter"){
     searchBtn.click();
    }
    
});


const searchButton =()=>{
    const searchInput =document.getElementById("search-city")
    const cityName = searchInput.value;
    emptyInput.textContent="";

    if(cityName===""){
          emptyInput.innerHTML =`
           <h4 class="text-start text-danger mt-2">Please enter a city name to search...</h4>`    
    }
    //clear search
    searchInput.value="";
    loadSearch(cityName)
}

const loadSearch = async (city)=>{
  const  api = "3be9bc24b0ed1677cda7f552b34791ce"; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}`;
  const res = await fetch(url);
  const data = await res.json();
  displayWeather(data);
}

const displayWeather =(temparature)=>{
if(temparature.message === 'city not found'){
    emptyInput.innerHTML=`<h4 class="text-start text-danger mt-2">City is not found...</h4>
    `
}
const createContainer =document.getElementById("container");
createContainer.textContent="";
console.log(temparature);
const localDate = convertUnixTimeToLocal(temparature.dt);
const sunriseTime = convertUnixTimeToLocal(temparature.sys.sunrise)
const windSpeed = convertUnixTimeToLocal(temparature.wind.speed);
const sunsetTime = convertUnixTimeToLocal(temparature.sys.sunset);
const createDiv = document.createElement("div")
createDiv.innerHTML=`
<h4 class="fs-2">
    ${temparature.name},${temparature.sys.country}
</h4>
<h6>${localDate.fullDate}</h6>
<h5>${temparature.weather[0].main}</h5>
<h5><span class="me-3">Sunrise:${sunriseTime.time12h} & <span class="ms-3"><Sunset:1>Sunset Time${sunsetTime.time12h}</Sunset:1></span></span></h5>
`
createContainer.appendChild(createDiv);
};


loadSearch("Dhaka")
const convertUnixTimeToLocal = (unixTime) => {
    const milliSeconds = unixTime * 1000;
    const humanDateFormat = new Date(milliSeconds);
    const convertedTimeObject = {
        fullDate: humanDateFormat.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        time12h:humanDateFormat.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }),
    };
    return convertedTimeObject;
};


