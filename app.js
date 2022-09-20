// import libs
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

let express = require('express');
let mongoose = require('mongoose');
let app = express();
let path = require('path');
let methodOverride = require('method-override');
let ejsMate = require('ejs-mate');
let ExpressError = require('./utility/ExpressError');
let mongoSanitize = require('express-mongo-sanitize');
let helmet = require('helmet');

let cgRoutes = require('./routes/campgrounds');
let reviewRoutes = require('./routes/reviews');
let userRoutes = require('./routes/users');

let session = require('express-session');
let flash = require('connect-flash');
let passport = require('passport');
let LocalStrategy = require('passport-local');
let User = require('./models/user');
let atlasUrl = process.env.ATLAS_URL || 'mongodb://localhost:27017/yelpcamp';
let MongoStore = require('connect-mongo');
let secret = process.env.SECRET || 'Thisisnotagoodsecret!';
let port = process.env.PORT || 3000;

// basic setting and daemon
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(session({
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({
        mongoUrl: atlasUrl,
        touchAfter: 24 * 3600,
        crypto: {secret}
    })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/codingisgreat/",
                "https://images.unsplash.com/",
                "https://unsplash.com"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

passport.use(new LocalStrategy(User.authenticate())); // Normally you need to put a verify func into strategy manually, but that Mongoose-related package seems to do it for us.
passport.serializeUser(User.serializeUser()); // Before using Passport strategy authenticating: Install => Configure (Put verify func) => Register (Use passport.use) => Employ (Put it in passport.authenticate, which is a middleware in routes)
passport.deserializeUser(User.deserializeUser()); // Again, that Mongoose-related package provides session callbacks needed.

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
mongoose.connect(atlasUrl)
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
    res.locals.currentUser = req.user;
    next();
})

app.use('/campgrounds', cgRoutes);
app.use('/campgrounds/:cgId/reviews', reviewRoutes);
app.use('/', userRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('homepage');
});

app.all('*', (req, res, next) =>  {
    next(new ExpressError(404, '404 Not Found'));
});

// error handling
app.use((err, req, res, next) => {
    let {status = 500, stack, message} = err;
    res.status(status).render('error', {statusCode : status, stack, message});
});
