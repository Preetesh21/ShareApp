const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Posts = require('../models/Posts')

// Add Get
router.get("/add", (req, res) => res.render('add'));

// POST 
router.post('/', ensureAuthenticated, async(req, res) => {
    try {
        req.body.user = req.user.id
        await Posts.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        res.render('error')
    }
})

// Get a specific Post
router.get("/:id", async(req, res) => {
    try {
        console.log(req.params.id)
        const stories = await Posts.findById(req.params.id).populate('user').lean()
        console.log(stories.title)
        res.render('single', {
            name: req.user.name,
            stories,
        })
    } catch (err) {
        console.log(err)
        res.send('error');
    }

});


module.exports = router;