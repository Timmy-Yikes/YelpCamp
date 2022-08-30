// Middleware used to check if the user is logged in before they try to access to some routes or do some operations which require authentication.
module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must log in first!');
        return res.redirect('/login');
    } else {
        next();
    }
}