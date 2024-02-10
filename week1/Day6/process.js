const writeFileAsync = require("./writefile");
const readFileAsync = require("./readfile");
const fs = require('fs').promises;

async function processFiles(...files) {
    for (let i = 0; i < files.length; i++) {
        try {
            
            await fs.access(files[i]);
            const content = await readFileAsync(files[i]);
            const modifiedContent = content.toUpperCase();
            await writeFileAsync(files[i], modifiedContent);
            console.log(`${files[i]} has been processed`);

        } catch (error) {
                console.error(`Error processing ${files[i]}:, ${error.message}`);
            }
        }
    }


// processFiles("file1.txt", "file2.txt", "file3.txt")

module.exports = processFiles;