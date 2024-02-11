import { processUserData } from './ProcessData.js';
import { summarizeAge } from './SummarizeData.js';

const fetchUserData = async () => {
    try {
        const response = await fetch('https://dummyjson.com/users');
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        const data = await response.json();
        //console.log('Fetched Data:', data);
        
        const processedData = processUserData(data);
        const {femaleUser,femaleDescription} = processedData;
        const totalAge = summarizeAge(femaleUser);
        console.log('Processed Users:');
        femaleDescription.forEach(user => {
            console.log(user);
        });
        console.log(`Total Age of Active Users: ${totalAge}`);
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
};

fetchUserData();
