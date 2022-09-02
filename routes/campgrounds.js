let express = require('express');
let router = express.Router();
const {getIndex, renderNewForm, getDetail, renderEditForm, putEditForm, postNewForm, deleteCampground} = require("../controllers/campgrounds");
let {catchAsync, validateCampground, isLoggedIn, isCgAuthor} = require('../utility/middlewares');

router.get('/', catchAsync(getIndex));

router.route('/new')
    .get(isLoggedIn, renderNewForm)
    .post(isLoggedIn, validateCampground, catchAsync(postNewForm));

router.route('/:id')
    .get(catchAsync(getDetail))
    .put(isLoggedIn, isCgAuthor, validateCampground, catchAsync(putEditForm))
    .delete(isLoggedIn, isCgAuthor, catchAsync(deleteCampground));

router.get('/:id/edit', isLoggedIn, isCgAuthor, catchAsync(renderEditForm));

module.exports = router;