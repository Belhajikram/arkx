const fs = require('fs/promises');
const cities = require('./cities');

async function readCityFromFile() {
    try {
        const cityName = await fs.readFile('input.txt', 'utf8');
        const city = cities.find((city) => city.name === cityName.trim());
        if (!city) {
            console.log('City not found.');
            return null;
        }
        console.log(`${city.name}, ${city.lat}, ${city.lng}`);
        return city; 
    } catch (error) {
        console.error('Error reading input.txt:', error);
        return null;
    }
}

async function fetchData(city) {
    const { lat, lng } = city;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current_weather=true`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.current_weather) {
            console.error('No current weather data found.');
            return null;
        }
        const temperature = data.current_weather.temperature;
        return temperature;
    } catch (error) {
        console.error('Error fetching temperature:', error);
        return null;
    }
}

async function main() {
    const city = await readCityFromFile(); 
    if (!city) {
        console.log('No city found.'); 
        return;
    }
    const temperature = await fetchData(city); 
    console.log(`City name: ${city.name}, Temperature: ${temperature}`);
}

main();
