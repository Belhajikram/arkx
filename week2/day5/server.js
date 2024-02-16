const http = require("http");
const url = require('url');
const cities = require('./cities');



const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

 if (path === '/products') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('I am a list of products :p');
  } else if (path == '/weather') {

    if (query) {
      let cityName = query.city;
      console.log(query)
      let cityData = cities.find((a) => a.name == cityName);
      console.log(cityData)
      if (cityData) {
        const { lat, lng } = cityData;
        const link = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
        const response = await fetch(link);
        const data = await response.json();
        const temperature = data.current_weather.temperature;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        let result = (`City name : ${cityName}, Temperature: ${temperature}`);
        console.log(result);
        res.end(result);
      }
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('This is the webpage');
  }
});

const PORT = 8008; 
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//http://localhost:8008/weather?city=Rabat