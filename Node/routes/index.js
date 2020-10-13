const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const Posts = require('../models/Posts')

// Welcome
router.get("/", (req, res) => res.render('welcome'));
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.user,
        Story: null
    })
);
// All stories of a user
router.get('/:id', ensureAuthenticated, async(req, res) => {
    try {
        const Story = await Posts.findById(req.params.id).populate('user')
        if (!Story) {
            return res.send('error/404')
        } else {
            console.log(Story);
            res.render('dashboard', {
                    user: req.user,
                    Story: Story
                })
                //return res.send("Check the Console");
        }
    } catch (err) {
        console.log(err)
        return res.send('error/404')
    }
})
module.exports = router;