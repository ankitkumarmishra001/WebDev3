const http = require("http");

const server = http.createServer((req, res) => {

    console.log("Request received:", req.url);

    if (req.url === "/") {
        res.end("<h1>Welcome to Smart Utility Toolkit</h1>");
    }

    else if (req.url === "/about") {
        res.end("<h1>About Page</h1><p>This project is created using Node.js.</p>");
    }

    else if (req.url === "/contact") {
        res.end("<h1>Contact Page</h1><p>Email: student@example.com</p>");
    }

    else {
        res.statusCode = 404;
        res.end("<h1>404 - Page Not Found</h1>");
    }

});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});