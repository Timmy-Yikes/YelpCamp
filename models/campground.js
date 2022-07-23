let mongoose = require('mongoose');

let CampgroundSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String
    },
    location: {
        type: String,
        require: true
    }
});

let Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;