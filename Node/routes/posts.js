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
        console.log("NONONNO")
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

// GET a user's all posts
router.get("/user/:id", async(req, res) => {
    try {
        console.log(req.params.id)
        const stories = await Posts.find({ user: req.params.id }).populate('user').lean()
        console.log(stories.title)
        res.render('single_user', {
            name: req.user.name,
            stories,
        })
    } catch (err) {
        console.log(err)
        res.send('error');
    }

});

// GET Edit a post
router.get('/edit/:id', ensureAuthenticated, async(req, res) => {
    try {
        const story = await Posts.findOne({
            _id: req.params.id,
        }).lean()

        if (!story) {
            return res.send('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/dashboard')
        } else {
            res.render('edit', {
                story,
            })
        }
    } catch (err) {
        console.error(err)
        return res.send('error/500')
    }
})

// PUT update the POST
router.put('/:id', ensureAuthenticated, async(req, res) => {
    try {
        let story = await Posts.findById(req.params.id).lean()
            //console.log(story)
        if (!story) {
            return res.send('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/dashboard')
        } else {
            story = await Posts.findOneAndUpdate({ _id: req.params.id }, req.body, {
                    new: true,
                    runValidators: true,
                })
                //console.log(story)
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// DELETE 
router.delete('/:id', ensureAuthenticated, async(req, res) => {
    try {
        console.log('hello')
        let story = await Posts.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/dashboard')
        } else {
            await Posts.remove({ _id: req.params.id })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.send('error/500')
    }
})

module.exports = router;