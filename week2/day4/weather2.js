const fs = require('fs/promises');
const cities = require ('./cities');
const { url } = require('inspector');


// Function to read city name from input.txt
async function readCityFromFile() {
    try {
        const cityName = await fs.readFile('input.txt', 'utf8');
        const city = cities.find((city) => city.name == cityName);
        const {lat, lng} = city;
        console.log(`${cityName}, ${ lat, lng }`);
       
    } catch (error) {
        console.error('Error reading input.txt:', error);
        return null;
    }
}
readCityFromFile()
.then(data => console.log(data))
.catch(err => console.log(err))


async function fetchData(city){
  const {lat, lng} = city;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const temperature = data.current_weather.temperature;
      return temperature;
    } catch (error) {
      console.error('Error fetching temperature:', error);
      return null;
    }
}

async function main() {
  const city = await fs.readFile('input.txt', 'utf8'); 
  if (!city) {
    console.log('No city found.'); 
    return;
  }

  const temperature = await fetchData(city); 
  console.log(`City name: ${city}, Temperature: ${temperature}`);
}

main();
