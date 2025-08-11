const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const weatherCard = document.getElementById('weather-card');
const cityNameEl = document.getElementById('city-name');
const currentDateEl = document.getElementById('current-date');
const weatherIconEl = document.getElementById('weather-icon');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const windSpeedEl = document.getElementById('wind-speed');
const forecastTempEl = document.getElementById('forecast-temp');

// API URL
const API_URL = 'https://goweather.herokuapp.com/weather/';

// --- Weather Icon Mapping ---
// A simple mapping to get an icon based on the weather description
const weatherIcons = {
    "Sunny": `<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
    "Clear": `<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`,
    "Partly cloudy": `<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>`,
    "Cloudy": `<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>`,
    "Rain": `<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>`,
    "Light rain": `<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15zM12 17l-2-2m2 2l2-2" /></svg>`,
    "Default": `<svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`
};

const getIcon = (description) => {
    // Find an icon key that is included in the description string
    const key = Object.keys(weatherIcons).find(k => description.toLowerCase().includes(k.toLowerCase()));
    return weatherIcons[key] || weatherIcons.Default;
};

// --- Core Function: Fetch and Display Weather ---
const fetchWeather = async (city) => {
    // 1. Show loader and hide other elements
    loader.classList.remove('hidden');
    weatherCard.classList.add('opacity-0', '-translate-y-4');
    errorMessage.classList.add('hidden');
    try {
        // 2. Fetch data from the API
        const response = await fetch(API_URL + city);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Check if API returned meaningful data (goweather returns 0 temp for not found)
        if (!data.temperature || data.temperature === "0 °C") {
            throw new Error('City not found or data unavailable');
        }
        // 3. Update the UI with the new data
        updateUI(data, city);
        // 4. Show the weather card with a transition
        weatherCard.classList.remove('opacity-0', '-translate-y-4');
    } catch (error) {
        console.error("Fetch Error:", error);
        // Show error message if fetch fails
        errorMessage.classList.remove('hidden');
    } finally {
        // 5. Hide the loader regardless of outcome
        loader.classList.add('hidden');
    }
};
// --- UI Update Function ---
const updateUI = (data, city) => {
    // City Name and Date
    cityNameEl.textContent = city;
    currentDateEl.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    // Main Weather Info
    temperatureEl.textContent = data.temperature;
    descriptionEl.textContent = data.description;
    weatherIconEl.innerHTML = getIcon(data.description);
    // Additional Details
    windSpeedEl.textContent = data.wind;
    // Show tomorrow's forecast temperature if available
    forecastTempEl.textContent = data.forecast?.[0]?.temperature || 'N/A';
};
// --- Event Listeners ---
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});
// --- Initial Load ---
// Fetch weather for a default location when the page loads
window.addEventListener('load', () => {
    fetchWeather('Bansdroni');
});