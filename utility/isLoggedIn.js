// Middleware used to check if the user is logged in before they try to access to some routes or do some operations which require authentication.
module.exports = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // There if you try to send some requests not being GET type without logged in, this returnTo thing would send you back to the original place you were requesting but using GET, so it will hit 404 route.
        req.flash('error', 'You must log in first!');
        return res.redirect('/login');
    } else {
        next();
    }
}