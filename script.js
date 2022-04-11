//using the Open Weather api 

// WARNING: I removed the "apiKey" variable from the very top of this script.
//I did so in order to push to Github, in order for program to (somewhat) work
//you need your API key! Go to Open Weather, copy your API key, and store it inside
// of a const variable called ---> "apiKey". Example: const apiKey = 'yourApiKeyGoesHere';
//put that on the very first line of the program, then run.

//const apiKey = 'apiKeyGoesHere';
const userForm = document.getElementById('city-input-form');
const selectedCityForm = document.getElementById('user-selected-city-form');

const div1 = document.getElementById('input-form-container');
const div2 = document.getElementById('user-choices');
const div3 = document.getElementById('weather-display-container');

let userSelectedCity;
let userSelectedState;
let userSelectedCountry;

let geoCoordInfo;

let latitude;
let longitude;


const getCoordinates = (e) => {
    e.preventDefault();
    const userCityInput = document.querySelector('input[type=text]').value;
    const apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=';
    const queryString = `&limit=5&appid=${apiKey}`;
    fetch(`${apiURL}${userCityInput}${queryString}`)
    .then((response) => {return response.json()})
    .then((value)=>{
        userForm.reset();
        geoCoordInfo = value;
        document.getElementById('selections').innerHTML = '';
        value.forEach((location)=>{
            let name;
            let state;
            let country;
            name = location.name;
            state = location.state;
            country = location.country;
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', `${name}-${state}-${country}`);
            optionElement.innerText = `Name: ${name}, State: ${state}, Country: ${country}`;
            document.getElementById('selections').appendChild(optionElement);
        })
        div2.style.display = 'flex';
        div1.style.display = 'none';
    });
}

userForm.onsubmit = getCoordinates;

selectedCityForm.onsubmit = (e) => {
    e.preventDefault();
    const selectedLocation = document.getElementById('selections').value;
    document.getElementById('selections').innerHTML = '';
    const selectionsArray = selectedLocation.split('-');
    userSelectedCity = selectionsArray[0];
    userSelectedState = selectionsArray[1];
    userSelectedCountry = selectionsArray[2];
    geoCoordInfo.forEach(object => {
        if (object.name == userSelectedCity && object.country == userSelectedCountry && object.state == userSelectedState){
            latitude = object.lat;
            longitude= object.lon;
        }
    })
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
    .then ((response) =>{
        return response.json();
    }).then((response)=>{

        weatherDescription = response.weather[0].description;
        temperature = response.main.temp;
        highTemp = response.main.temp_max;
        lowTemp = response.main.temp_min;
        feelsLike = response.main.feels_like;

        div1.style.display = 'none';
        div2.style.display = 'none';
        div3.style.display = 'flex';
        div3.innerHTML = `
        <h1>Your Current Forecast</h1>
        <ul>
        <li>Description: ${weatherDescription}</li>
        <li>Current temperature: ${temperature}&#8457</li>
        <li>Feels like: ${feelsLike}&#8457</li>
        <li>The high today is: ${highTemp}&#8457</li>
        <li>The low today is: ${lowTemp}&#8457</li>
        </ul>
        `;
    })
}