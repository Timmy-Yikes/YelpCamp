let mongoose = require('mongoose');
const Campground = require("../models/campground");
const Review = require("../models/review");

// Comparing the current user ID with the ID of author recorded in current campground info. If so, the user is OK to go ahead.
module.exports.isCgAuthor = async (req, res, next) => {
    let {id} = req.params;
    let cg = await Campground.findById(id);
    if (!cg) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    if (!cg.author._id.equals(req.user._id)) { // TODO: Get the hang of working mechanism of res.locals
        req.flash('error', 'You cannot edit the campground not originally created by yourself.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Comparing the current user ID with the ID of author recorded in current review info. If so, the user is OK to go ahead.
module.exports.isReviewAuthor = async (req, res, next) => {
    let {cgId, rId} = req.params;
    let r = await Review.findById(rId).populate('author');
    if (!req.user._id.equals(r.author._id)) {
        req.flash('error', 'You cannot delete the review not originally created by yourself.');
        return res.redirect(`/campgrounds/${cgId}`);
    }
    next();
}