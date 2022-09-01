let mongoose = require('mongoose');
const {Schema} = require("mongoose");

let CampgroundSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

let Campground = mongoose.model('Campground', CampgroundSchema);

console.log('running campground.js!')

module.exports = Campground;