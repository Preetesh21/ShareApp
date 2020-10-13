const moongoose = require('mongoose');

const Userscheme = new moongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const User = moongoose.model('User', Userscheme);

module.exports = User;