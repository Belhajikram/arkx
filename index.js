const processFiles = require('./process');

async function main() {
  const filePaths = ['file1.txt', 'file2.txt', 'file3.txt'];

  try {
    await processFiles(filePaths);
    console.log('Files processed successfully.');
  } catch (error) {
    console.error(`Error in the main application: ${error.message}`);
  }
}


main();
