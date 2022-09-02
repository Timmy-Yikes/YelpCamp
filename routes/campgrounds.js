let express = require('express');
let router = express.Router();
const {getIndex, renderNewForm, getDetail, renderEditForm, putEditForm, postNewForm, deleteCampground} = require("../controllers/campgrounds");
let {catchAsync, validateCampground, isLoggedIn, isCgAuthor} = require('../utility/middlewares');

router.get('/', catchAsync(getIndex));

router.get('/new', isLoggedIn, renderNewForm);

router.get('/:id', catchAsync(getDetail));

router.get('/:id/edit', isLoggedIn, isCgAuthor, catchAsync(renderEditForm));

router.put('/:id', isLoggedIn, isCgAuthor, validateCampground, catchAsync(putEditForm));

router.post('/new', isLoggedIn, validateCampground, catchAsync(postNewForm));

router.delete('/:id', isLoggedIn, isCgAuthor, catchAsync(deleteCampground));

module.exports = router;