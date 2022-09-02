let express = require('express');
let passport = require('passport')
let {checkReturnTo, validateUser, catchAsync} = require('../utility/middlewares');
const {renderRegisterForm, renderLoginForm, logout, registerUser, login} = require("../controllers/users");

let router = express.Router();

router.route('/register')
    .get(catchAsync(renderRegisterForm))
    .post(validateUser, catchAsync(registerUser));

router.route('/login')
    .get(catchAsync(renderLoginForm))
    .post(checkReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), login);

router.post('/logout', logout);

module.exports = router;