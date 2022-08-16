// import libs and application creating
let express = require('express');
let mongoose = require('mongoose');
let app = express();
let path = require('path');
let methodOverride = require('method-override');
let ejsMate = require('ejs-mate');
let ExpressError = require('./utility/ExpressError');
let catchAsync = require('./utility/catchAsync');
let Campground = require('./models/campground');
let Review = require('./models/review');
let cgSchema = require('./validationSchemas').campgroundSchema;
let rSchema = require('./validationSchemas').reviewSchema;

// define helper functions
let validateCampground = (req, res, next) => {
    let result = cgSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

let validateReview = (req, res, next) => {
    let result = rSchema.validate(req.body);
    if (result.error) throw new ExpressError(400, result.error.details.map(elem => elem.message).join(','));
    else next();
}

// basic setting and daemon
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.listen('3000', () => {
    console.log('Listening on port 3000!');
});
mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => {
        console.log('MongoDB connected on main file!');
    })
    .catch((err) => {
        console.log('MongoDB connecting failed on main file!');
        console.log(err);
    });

// route setting
app.get('/', (req, res) => {
    res.send('YelpCamp!');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    let cgs = await Campground.find({});
    res.render('index', {cgs});
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id).populate('reviews');
    res.render('detail', {cg});
}));

app.get('/campgrounds/:cgId/reviews/new', catchAsync(async (req, res) => {
    let {cgId} = req.params;
    let cg = await Campground.findById(cgId);
    res.render('newReview', {cg});
}))

app.post('/campgrounds/:cgId/reviews', validateReview, catchAsync(async (req, res) => {
    let {cgId} = req.params;
    let cg = await Campground.findById(cgId);
    let newReview = await Review.create(req.body);
    cg.reviews.push(newReview);
    await cg.save();
    res.redirect(`/campgrounds/${cgId}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id);
    res.render('edit', {cg});
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body, {new: true});
    res.redirect(`/campgrounds/${id}`);
}));

app.post('/campgrounds/new', validateCampground, catchAsync(async (req, res) => {
    let {name, image, price, description, location} = req.body;
    let newCampground = await Campground.create({name, image, price, description, location});
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    let {id} = req.params;
    await Review.deleteMany({campground: id});
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.delete('/campgrounds/:cgId/reviews/:rId', catchAsync(async (req, res) => {
    let {cgId, rId} = req.params;
    let cg = await Campground.findById(cgId);
    let r = await Review.findById(rId);
    cg.reviews.splice(cg.reviews.indexOf(rId), 1);
    await Review.findByIdAndDelete(rId);
    await cg.save();
    res.redirect(`/campgrounds/${cgId}`);
}))

app.all('*', (req, res, next) =>  {
    next(new ExpressError(404, '404 Not Found'));
});

// error handling
app.use((err, req, res, next) => {
    let {status = 500, stack} = err;
    res.status(status).render('error', {statusCode : status, stack});
});