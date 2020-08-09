// the server will be here

// make server
// 1 - bring in express
const express = require('express');
// 1.5 - bring in routers


// 2 - create server
const server = express();

// 3 - add middleware to parse JSON request bodies
server.use(express.json());
// 3.5 - add the routers


// 4 - have the server start listening
server.listen(8000, () => {
    console.log("Server listening on port 8000");
});