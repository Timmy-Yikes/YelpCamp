let mongoose =  require('mongoose');

let reviewSchema = new mongoose.Schema({
    text: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    }
});

module.exports = mongoose.model('Review', reviewSchema);
