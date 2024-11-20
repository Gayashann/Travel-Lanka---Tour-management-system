const mongoose = require('mongoose');

const Schema = mongoose.Schema({

    username : {
        type : String,
        required : true
    },

    ratings : {
        type : Number,
        required : true
    },

    service : {
        type : String,
        required : true
    },

    message : {
        type : String,
        required : true
    },

    visibility: { type: String, enum: ['public', 'private'], default: 'public' }
}, {timestamps : true})

const Feedback = mongoose.model("Feedback", Schema);

module.exports = Feedback;