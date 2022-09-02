const User = require("../models/user");

module.exports.renderRegisterForm = async (req, res) => {
    res.render('users/register');
}

module.exports.renderLoginForm = async (req, res) => {
    res.render('users/login');
}

module.exports.logout = (req, res, next) => {
    // Here we have to put all remnants into the parenthesis or the code doesn't work.
    req.logout(err => {
        if(err) return next(err);
        req.flash('success', 'Successfully logged out!');
        res.redirect('/campgrounds/');
    });
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    let returnTo = res.locals.returnTo || '/campgrounds';
    res.redirect(returnTo);
}