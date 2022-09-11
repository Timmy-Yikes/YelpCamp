let mongoose = require('mongoose');
const {Schema} = require("mongoose");
const {func} = require("joi");

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
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
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
}, {
    toJSON: {
        virtuals: true
    }
});

CampgroundSchema.virtual('properties.popUpText').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.name}</a><br>
            <p>${this.description.substring(0, 20)}...</p>`
})

let Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;