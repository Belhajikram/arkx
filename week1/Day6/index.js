const processFiles = require('./process');

async function main() {
  try {
    await processFiles('file1.txt', 'file2.txt', 'file3.txt');
    console.log('Files processed successfully.');
  } catch (error) {
    console.error(`Error in the main application: ${error.message}`);
  }
}


main();
