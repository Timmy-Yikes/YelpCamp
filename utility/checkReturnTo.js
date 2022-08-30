// Due to updates of Passport, use new middleware to store session info.
module.exports = (req, res, next) => {
    if(req.session.returnTo) res.locals.returnTo = req.session.returnTo;
    next();
}