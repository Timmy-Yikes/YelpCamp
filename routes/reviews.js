let express = require('express');
const catchAsync = require("../utility/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {reviewSchema: rSchema} = require("../validationSchemas");
const ExpressError = require("../utility/ExpressError");
let router = express.Router({mergeParams: true});
let isLoggedIn = require('../utility/isLoggedIn');
let {isReviewAuthor} = require('../utility/isAuthor');

let validateReview = (req, res, next) => {
    let result = rSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    let {cgId} = req.params;
    let cg = await Campground.findById(cgId);
    res.render('newReview', {cg});
}))

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    let {cgId} = req.params;
    let cg = await Campground.findById(cgId);
    let newReview = await Review.create(req.body); // Here you could add the author property manually by 'newReview.author = req.user._id', but I've chosen to integrate the info into the form.
    cg.reviews.push(newReview); // You could reference that on Mongoose docs.
    await cg.save();
    req.flash('success', 'New review successfully created!');
    res.redirect(`/campgrounds/${cgId}`);
}))

router.delete('/:rId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
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