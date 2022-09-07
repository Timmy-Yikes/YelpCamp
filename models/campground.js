let mongoose = require('mongoose');
const {Schema} = require("mongoose");

let ImageSchema = mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_scale,w_200');
});

let CampgroundSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: {
        type: [ImageSchema]
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

module.exports = Campground;