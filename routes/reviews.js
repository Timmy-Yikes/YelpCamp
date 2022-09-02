let express = require('express');
let router = express.Router({mergeParams: true});
let {catchAsync, validateReview, isLoggedIn, isReviewAuthor} = require('../utility/middlewares');
const {getNewForm, postNewForm, deleteReview} = require("../controllers/reviews");

router.get('/new', isLoggedIn, catchAsync(getNewForm))

router.post('/', isLoggedIn, validateReview, catchAsync(postNewForm))

router.delete('/:rId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;