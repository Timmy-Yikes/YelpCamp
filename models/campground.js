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

let cg1 = new Campground({
    name: 'cg1',
    price: 1,
    description: 'test campground 1',
    location: 'N/A'
})

let cg2 = new Campground({
    name: 'cg2',
    price: 2,
    description: 'test campground 2',
    location: 'N/A'
})

let cg3 = new Campground({
    name: 'cg3',
    price: 3,
    description: 'test campground 3',
    location: 'N/A'
})

let cg4 = new Campground({
    name: 'cg4',
    price: 4,
    description: 'test campground 4',
    location: 'N/A'
})

let cg5 = new Campground({
    name: 'cg5',
    price: 5,
    description: 'test campground 5',
    location: 'N/A'
})

/*Campground.insertMany([cg1, cg2, cg3, cg4, cg5], (err, res)=> {
    if(err) console.log(err);
    if(res) console.log(res);
})*/

console.log('running campground.js again!')

module.exports = Campground;