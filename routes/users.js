let express = require('express');
let User = require('../models/user');
const {userSchema} = require("../validationSchemas");
const ExpressError = require("../utility/ExpressError");
let passport = require('passport')
let catchAsync = require('../utility/catchAsync');

let router = express.Router();

let validateUser = (req, res, next) => {
    let result = userSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

router.get('/register',async (req, res) => {
    res.render('users/register');
})

router.post('/register', validateUser, async (req, res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = User({username, email});
        newUser = await User.register(newUser, password);
        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('campgrounds');
    }
});

module.exports = router;