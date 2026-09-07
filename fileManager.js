const fs = require("fs");

const operation = process.argv[2];
const fileName = "myFile.txt";

console.log("Operation selected:", operation);

if (operation === "create") {

    fs.writeFile(fileName, "Hello! This file was created using Node.js.", (err) => {
        if (err) {
            console.log("Error creating file:", err.message);
        } else {
            console.log("File created successfully.");
        }
    });

}

else if (operation === "read") {

    fs.readFile(fileName, "utf8", (err, data) => {
        if (err) {
            console.log("Error: File does not exist.");
        } else {
            console.log("File content:", data);
        }
    });

}

else if (operation === "update") {

    fs.appendFile(fileName, "\nThis line was added using appendFile().", (err) => {
        if (err) {
            console.log("Error updating file:", err.message);
        } else {
            console.log("File updated successfully.");
        }
    });

}

else if (operation === "delete") {

    fs.unlink(fileName, (err) => {
        if (err) {
            console.log("Error: File does not exist or cannot be deleted.");
        } else {
            console.log("File deleted successfully.");
        }
    });

}

else {

    console.log("Invalid operation!");
    console.log("Please use: create, read, update, or delete");

}