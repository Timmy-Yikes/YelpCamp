// import libs and application creating
let express = require('express');
let mongoose = require('mongoose');
let app = express();
let path = require('path');
let methodOverride = require('method-override');
let ejsMate = require('ejs-mate');
let ExpressError = require('./utility/ExpressError');
let cgRoutes = require('./routes/campgrounds');
let rRoutes = require('./routes/reviews');
let session = require('express-session');
let flash = require('connect-flash');

// basic setting and daemon
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'Thisisnotagoodsecret!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());
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
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/campgrounds', cgRoutes);
app.use('/campgrounds/:cgId/reviews', rRoutes);
app.use(express.static(path.join(__dirname, 'public')));

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