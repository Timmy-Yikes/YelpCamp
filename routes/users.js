let express = require('express');
let User = require('../models/user');
const {userSchema} = require("../validationSchemas");
const ExpressError = require("../utility/ExpressError");
let passport = require('passport')
let catchAsync = require('../utility/catchAsync');
let checkReturnTo = require('../utility/checkReturnTo');

let router = express.Router();

let validateUser = (req, res, next) => {
    let result = userSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
};

router.get('/register',async (req, res) => {
    res.render('users/register');
});

router.get('/login', async (req, res) => {
    res.render('users/login');
});

router.get('/logout', (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Come on you are not logged in!');
        res.redirect('/login');
    } else {
        // Here we have to put all remnants into the parenthesis or the code doesn't work.
        req.logout(err => {
            if(err) return next(err);
            req.flash('success', 'Successfully logged out!');
            res.redirect('/campgrounds/');
        });
    }
});

router.post('/register', validateUser, async (req, res, next) => {
    try {
        let {username, email, password} = req.body;
        let newUser = User({username, email});
        newUser = await User.register(newUser, password);
        req.login(newUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('campgrounds');
    }
});

router.post('/login', checkReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    let returnTo = res.locals.returnTo || '/campgrounds';
    res.redirect(returnTo);
})

module.exports = router;