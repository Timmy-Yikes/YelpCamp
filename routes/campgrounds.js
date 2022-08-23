let express = require('express');
const catchAsync = require("../utility/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {campgroundSchema: cgSchema} = require("../validationSchemas");
const ExpressError = require("../utility/ExpressError");
let router = express.Router();

let validateCampground = (req, res, next) => {
    let result = cgSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

router.get('/', catchAsync(async (req, res) => {
    let cgs = await Campground.find({});
    res.render('index', {cgs});
}));

router.get('/new', (req, res) => {
    res.render('new');
});

router.get('/:id', catchAsync(async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id).populate('reviews');
    res.render('detail', {cg});
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id);
    res.render('edit', {cg});
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body, {new: true});
    res.redirect(`/campgrounds/${id}`);
}));

router.post('/new', validateCampground, catchAsync(async (req, res) => {
    let newCampground = await Campground.create(req.body);
    req.flash('success', 'New campground successfully created!');
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    let {id} = req.params;
    await Review.deleteMany({campground: id});
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

module.exports = router;