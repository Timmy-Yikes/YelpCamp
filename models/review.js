let mongoose =  require('mongoose');

let reviewSchema = new mongoose.Schema({
    text: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campground'
    }
});

module.exports = mongoose.model('Review', reviewSchema);
