const {campgroundSchema, reviewSchema, userSchema} = require("../validationSchemas");
const ExpressError = require("./ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");

// A wrapper for catching async function error without having to add try/catch to every async function. Could be removed if updated to Express 5.
module.exports.catchAsync = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports.validateCampground = (req, res, next) => {
    let result = campgroundSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

// Middleware used to check if the user is logged in before they try to access to some routes or do some operations which require authentication.
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // There if you try to send some requests not being GET type without logged in, this returnTo thing would send you back to the original place you were requesting but using GET, so it will hit 404 route.
        req.flash('error', 'You must log in first!');
        return res.redirect('/login');
    } else {
        next();
    }
}

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

// Due to updates of Passport, use new middleware to store session info.
module.exports.checkReturnTo = (req, res, next) => {
    if(req.session.returnTo) res.locals.returnTo = req.session.returnTo;
    next();
}

module.exports.validateUser = (req, res, next) => {
    let result = userSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}