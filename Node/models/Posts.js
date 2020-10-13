const moongoose = require('mongoose');

const Postscheme = new moongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Posts = moongoose.model('Posts', Postscheme);

module.exports = Posts;