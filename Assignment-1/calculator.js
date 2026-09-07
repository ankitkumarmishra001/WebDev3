const operation = process.argv[2];
const num1 = Number(process.argv[3]);
const num2 = Number(process.argv[4]);

console.log("Operation:", operation);
console.log("Number 1:", num1);
console.log("Number 2:", num2);

if (operation === "add") {
    console.log("Result:", num1 + num2);
}
else if (operation === "subtract") {
    console.log("Result:", num1 - num2);
}
else if (operation === "multiply") {
    console.log("Result:", num1 * num2);
}
else if (operation === "divide") {
    if (num2 === 0) {
        console.log("Error: Cannot divide by zero.");
    } else {
        console.log("Result:", num1 / num2);
    }
}
else {
    console.log("Invalid operation!");
    console.log("Please use: add, subtract, multiply, or divide");
}