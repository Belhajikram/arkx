const fs = require('fs').promises;

async function readFileAsync(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}


module.exports = readFileAsync ;

