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
router.delete("/api/posts/:id", (req, res) => {
    db.remove(req.params.id)
        .then((response) => {
            console.log(response);
            if (response === 1) {  
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: "The post could not be removed." });
        });
});

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
router.post("/api/posts/:postId/comments", (req, res) => {
    // check if the request contains input
    if (!req.body.text) {
        // adding the return to cancel the request
        return res.status(400).json({ errorMessage: "Please provide text for the comment." });
    }
    // start the request
    db.insertComment({ text: req.body.text, post_id: req.params.postId })
        // the comment was added to the database
        .then((idObj) => {
            // find the new comment
            // Don't forget the id is an object
            db.findCommentById(idObj.id)
                .then((comment) => {
                    console.log(comment);
                    if (comment.length === 0) {
                        res.json({ message: "This comment is apparently an empty array"})
                    } else {
                        // return the new comment
                        res.status(201).json(comment);
                    }
                })
                .catch((error) => {
                    // couldn't find the comment, let the client know
                    console.log(error);
                    res.status(500).json({ error: "There was an error while trying to retrieve the newly created comment." });
                });
        })
        // the comment was not added
        .catch((error) => {
            console.log(error);
            db.findById(req.params.postId)
                .then((post) => {
                    if (post.length === 0) {
                        // the post ID does not exist
                        res.status(404).json({ message: "The post with the specified ID does not exist." });
                    } else {
                        // the comment could not be saved
                        res.status(500).json({ error: "There was an error while saving the comment to the database." });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    // there was an error while trying to find the post with that id
                    res.status(500).json({ error: "There was an error while saving the comment to the database." });
                });
        });
});

// 4 - export the whole router
module.exports = router;