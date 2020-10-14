const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get("/login", (req, res) => res.render('login'));

router.get("/register", (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    console.log(req.body);
    const { name, email, password, password2 } = req.body;
    const errors = []
    if (!name || !email || !password || !password2) {
        errors.push('Please fill all the fields');
    }
    if (password !== password2) {
        errors.push('Please type passwords same');
    }
    if (password2.length < 6) {
        errors.push('Please enter a password greater than 6');
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push("Email already in use");
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    console.log('sssss')
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    console.log(newUser);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err)
                                throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are being successfully registered.')
                                    res.redirect("login");
                                })
                                .catch(err => console.log(err))
                        })
                    })

                }
            })
            .catch(err => console.log(err))
    }
})

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

// Profile
router.get('/profile', ensureAuthenticated, async(req, res) => {
    try {
        const curr = await User.findById(req.user.id).lean();
        console.log(curr.name)
        res.render('profile', {
            curr
        });
    } catch (err) {
        console.log(err);
        res.send("error");
    }
})

module.exports = router;