let mongoose = require('mongoose');
let Campground = require('../models/campground');
let cities = require('./cities');
let helpers = require('./seedHelpers');
const {compile} = require("ejs");

mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => {
        console.log('MongoDB connected to seed index!');
    })
    .catch((err) => {
        console.log('MongoDB connecting failed on seed index!');
        console.log(err);
    });

let initDB = async () => {
    Campground.deleteMany({}, (err, res) => {
        if(err) {
            console.log(err);
            console.log('Deletion failed');
        } else {
            console.log('Deletion success');
        }
    });
    let camps = [];
    for (let i = 0; i < 50; i++) {
        let rand = Math.floor(Math.random() * 1000);
        let camp = new Campground({
            name: `${helpers.descriptors[Math.floor(Math.random() * helpers.descriptors.length)]} ${helpers.places[Math.floor(Math.random() * helpers.places.length)]}`,
            location: `${cities[rand].city}, ${cities[rand].state}`
        });
        camps.push(camp);
    }
    Campground.insertMany(camps, (err, res) => {
        if(err) {
            console.log(err);
            console.log('init inserting failed');
        } else {
            console.log('init inserting success');
        }
    })
};

initDB();

