const fs = require('fs').promises;

async function writeFileAsync(filePath, content) {
    try {
      await fs.writeFile(filePath, content);
      return 'File written successfully.';
    } catch (error) {
      return `Error writing to file: ${error.message}`;
    }
  }
  

  module.exports = writeFileAsync ;
