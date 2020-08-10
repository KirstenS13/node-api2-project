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
router.post("/api/posts", (req, res) => {
    if (!req.body.title || !req.body.contents) {
        // adding the return to cancel the request
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
    db.insert({ title: req.body.title, contents: req.body.contents })
        .then((postId) => {
            db.findById(postId.id)
                .then((post) => {
                    res.status(201).json(post);
                })
                .catch((error) => {
                res.status(500).json({ error: "There was an error while saving the post to the database." })
            })  
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the post to the database." });
        });
});

// get post by id
router.get("/api/posts/:id", (req, res) => {
    db.findById(req.params.id)
        .then((post) => {
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                console.log("post", post);
                res.json(post);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "The post information could not be retrieved." });
        });
});

// delete a post

// update a post

// get comments on a post
router.get("/api/posts/:postId/comments", (req, res) => {
    db.findPostComments(req.params.postId)
        .then((comments) => {
            if (comments.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                res.json(comments);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "The comments information could not be retrieved." })
        });
});

// create a comment on a post

// get comment on a post by id

// 4 - export the whole router
module.exports = router;