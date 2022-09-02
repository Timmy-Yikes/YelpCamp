let express = require('express');
let passport = require('passport')
let {checkReturnTo, validateUser, catchAsync} = require('../utility/middlewares');
const {renderRegisterForm, renderLoginForm, logout, registerUser, login} = require("../controllers/users");

let router = express.Router();

router.get('/register', catchAsync(renderRegisterForm));

router.get('/login', catchAsync(renderLoginForm));

router.post('/logout', logout);

router.post('/register', validateUser, catchAsync(registerUser));

router.post('/login', checkReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), login);

module.exports = router;