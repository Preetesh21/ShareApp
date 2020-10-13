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



module.exports = router;