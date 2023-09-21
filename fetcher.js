const request = require("request");
const fs = require("fs");
const readline = require("readline");

// declare variables to store the url and localFilePath command line arguments
const args = process.argv.slice(2);
const url = args[0];
const localFilePath = args[1];

// request the resource at the url and write it to the localFilePath
const requestAndWriteFile = function() {
  request(url, (requestError, response, body) => {
    if (requestError || response.statusCode !== 200) {
      console.error("Error: error fetching data");
      return;
    }

    fs.writeFile(localFilePath, body, writeError => {
      if (writeError) {
        console.error("Error: error writing file");
        return;
      }
      
      // once the file is written, print out a completion message
      console.log(`Downloaded and saved ${response.headers["content-length"]} bytes to ${localFilePath}`);
    });
  });
};

// check if the user wants to overwrite the file if it already exists and call the requestAndWriteFile function
const checkFileExists = function() {
  fs.access(localFilePath, fs.F_OK, (accessError) => {
    // if file does not already exist
    if (accessError) {
      requestAndWriteFile();
    }

    // if file already exists
    if (!accessError) {
      console.log("File already exists");

      // create readline interface
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      // prompt the user whether they want to overwrite the file
      rl.question("Do you want to overwrite the file? (Y/N, then hit enter) ", (answer) => {
        if (answer === "Y") {
          rl.close();
          requestAndWriteFile();
        }
        if (answer === "N") {
          process.exit();
        }
      });
    }
  });
};

checkFileExists();
