const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const multer = require('multer');
const Posts = require('../models/Posts')
const path = require('path')


// Storage Engine
const storage = multer.diskStorage({
    destination: './public/files',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
let upload = multer({
    storage: storage,
    fileFilter: async function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('upload-file');

// Check File Type
async function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|pdf|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// Download a Post
router.get('/download/:id', async(req, res) => {
    try {
        console.log(req.params.id)
        const story = await Posts.findById(req.params.id)
        if (!story) {
            res.render('dashboard');
        } else {
            story.path = '../public' + story.path;
            var filePath = path.join(__dirname, story.path); // Or format the path using the `id` rest param
            console.log(filePath)
            res.download(filePath);
        }
    } catch (err) {
        console.log(err);
        res.send("error")
    }
});


// Add Get
router.get("/add", (req, res) => res.render('add'));

// POST 
router.post('/', ensureAuthenticated, async(req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.render('dashboard', {
                msg: err
            });
        } else {
            //console.log(`/files/${req.file.filename}`)
            try {
                req.body.user = req.user.id
                if (req.file) {
                    req.body.path = `/files/${req.file.filename}`
                }
                var post = new Posts(req.body);
                post.save(function(error) {
                    if (error) {
                        throw error;
                    }
                    // await Posts.create(req.body)
                    res.redirect('/dashboard')
                });
            } catch (err) {
                console.error(err)
                res.send('error')
            }
        }
    });
});

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