const express = require('express');
const ejs = require("express-ejs-layouts");
const mongoose = require('mongoose');
const session = require("express-session")
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session)
const app = new express();
const passport = require('passport')

// Database
const db = require('./config/keys').mongouri;


require('./config/passport')(passport)

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to the db."))
    .catch(err => console.log('asa', err));

// EJS Middleware
app.use(ejs);
app.set('view engine', 'ejs');

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Sessions Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Global Vars defining the flash messages color
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Listening on Port", PORT));