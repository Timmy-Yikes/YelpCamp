let express = require('express');
const catchAsync = require("../utility/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {reviewSchema: rSchema} = require("../validationSchemas");
const ExpressError = require("../utility/ExpressError");
let router = express.Router({mergeParams: true});

let validateReview = (req, res, next) => {
    let result = rSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

router.get('/new', catchAsync(async (req, res) => {
    let {cgId} = req.params;
    let cg = await Campground.findById(cgId);
    res.render('newReview', {cg});
}))

router.post('/', validateReview, catchAsync(async (req, res) => {
    let {cgId} = req.params;
    let cg = await Campground.findById(cgId);
    let newReview = await Review.create(req.body);
    cg.reviews.push(newReview);
    await cg.save();
    req.flash('success', 'New review successfully created!');
    res.redirect(`/campgrounds/${cgId}`);
}))

router.delete('/:rId', catchAsync(async (req, res) => {
    let {cgId, rId} = req.params;
    let cg = await Campground.findById(cgId);
    let r = await Review.findById(rId);
    cg.reviews.splice(cg.reviews.indexOf(rId), 1);
    await Review.findByIdAndDelete(rId);
    await cg.save();
    req.flash('success', 'Review successfully deleted!');
    res.redirect(`/campgrounds/${cgId}`);
}))

module.exports = router;