const isEven = require("./isEven");

const number = Number(process.argv[2]);

if (isEven(number)) {
    console.log(number + " is an even number");
} else {
    console.log(number + " is an odd number");
}



