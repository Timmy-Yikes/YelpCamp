let mongoose = require('mongoose');

let CampgroundSchema = mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    }
});

let Campground = mongoose.model('Campground', CampgroundSchema);

console.log('running campground.js!')

module.exports = Campground;