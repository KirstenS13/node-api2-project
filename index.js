// the server will be here

// make server
// 1 - bring in express
const express = require('express');
// 1.5 - bring in routers
const postsRouter = require('./posts/posts-router');

const port = process.env.PORT || 8000;

// 2 - create server
const server = express();

// 3 - add middleware to parse JSON request bodies
server.use(express.json());
// 3.5 - add the routers
server.use(postsRouter);

// Optional - define endpoints that don't live in routers
server.get("/", (req, res) => {
    res.json({ message: "Hi, it's me the server. I'm working." });
});

// 4 - have the server start listening
server.listen(port, () => {
    console.log("Server listening on port 8000");
});