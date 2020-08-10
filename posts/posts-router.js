// router for the posts goes here

// make a router
// 1 - bring in express
const express = require('express');
// 1.5 - bring in database file
const db = require('../data/db');

// 2 - create the router with express
const router = express.Router();

// 3 - define endpoints

// get posts
router.get("/api/posts", (req, res) => {
    db.find()
        .then((posts) => {
            res.json(posts)
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "The posts information could not be retrieved." })
        });
});

// create a post

// get post by id

// delete a post

// update a post

// get comments on a post

// create a comment on a post

// 4 - export the whole router
module.exports = router;