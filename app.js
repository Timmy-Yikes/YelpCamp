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
let rSchema = require('./validationSchemas').reviewSchema;
let cgRoutes = require('./routes/campgrounds');
let rRoutes = require('./routes/reviews');

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
app.use('/campgrounds', cgRoutes);
app.use('/campgrounds/:cgId/reviews', rRoutes);

app.get('/', (req, res) => {
    res.send('YelpCamp!');
});

app.all('*', (req, res, next) =>  {
    next(new ExpressError(404, '404 Not Found'));
});

// error handling
app.use((err, req, res, next) => {
    let {status = 500, stack} = err;
    res.status(status).render('error', {statusCode : status, stack});
});