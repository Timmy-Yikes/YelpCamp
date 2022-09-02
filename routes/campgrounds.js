let express = require('express');
const catchAsync = require("../utility/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {campgroundSchema: cgSchema} = require("../validationSchemas");
const ExpressError = require("../utility/ExpressError");
let router = express.Router();
let isLoggedIn = require('../utility/isLoggedIn');
let {isCgAuthor} = require('../utility/isAuthor');

let validateCampground = (req, res, next) => {
    let result = cgSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

router.get('/', catchAsync(async (req, res) => {
    let cgs = await Campground.find({});
    res.render('index', {cgs});
}));

router.get('/new', isLoggedIn, (req, res) => {
    console.log(req.user)
    res.render('new');
});

router.get('/:id', catchAsync(async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id).populate('reviews').populate('author'); // You can populate nested reviews' author property by using a nesting setting object.
    if (!cg) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    for (let review of cg.reviews) {
        await review.populate('author');
        await review.populate('campground');
    }
    res.render('detail', {cg});
}));

router.get('/:id/edit', isLoggedIn, isCgAuthor, catchAsync(async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id);
    res.render('edit', {cg});
}));

router.put('/:id', isLoggedIn, isCgAuthor, validateCampground, catchAsync(async (req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body, {new: true});
    req.flash('success', 'Campground successfully updated!')
    res.redirect(`/campgrounds/${id}`);
}));

router.post('/new', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    let newCampground = await Campground.create(req.body);
    req.flash('success', 'New campground successfully created!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.delete('/:id', isLoggedIn, isCgAuthor, catchAsync(async (req, res) => {
    let {id} = req.params;
    await Review.deleteMany({campground: id});
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
}));

module.exports = router;