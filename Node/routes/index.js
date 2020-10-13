const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Posts = require('../models/Posts')

// Welcome
router.get("/", (req, res) => res.render('welcome'));


// Dashboard Lists all the available Posts
router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    try {
        const stories = await Posts.find().populate('user').lean()
        res.render('dashboard', {
            name: req.user.name,
            stories,
        })
    } catch (err) {
        console.error(err)
        res.send('error/500')
    }
});

module.exports = router;