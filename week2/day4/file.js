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

async function writeCity(txt, cityName){
    const pathLink = `./${cityName}.txt`
    try {
        await fs.access(pathLink, constants.F_OK)
        await fs.unlink(pathLink)
    } catch (error) {
        console.log(`A file named ${cityName}.txt is created`)
    }
    await fs.writeFile(pathLink, txt)
    console.log("the temperature is added")
}

async function main() {
    const city = await readCityFromFile(); 
    if (!city) {
        console.log('No city found.'); 
        return;
    }
    const temperature = await fetchData(city); 
    const content =`City name: ${city.name}, Temperature: ${temperature}`;
    console.log(city.name)
    await writeCity(content, city.name)
}

main();
