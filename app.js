// import libs and application creating
let express = require('express');
let mongoose = require('mongoose');
let methodOverride = require('method-override');
let app = express();
let path = require('path');
let Campground = require('./models/campground');
let ejsMate = require('ejs-mate');
let ExpressError = require('./utility/ExpressError');
let catchAsync = require('./utility/catchAsync');

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
    let cg = await Campground.findById(id);
    res.render('detail', {cg});
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id);
    res.render('edit', {cg});
}));

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    let {id} = req.params;
    // console.log(req.params);
    // console.log(req.body);
    let {name, location} = req.body;
    Campground.findByIdAndUpdate(id, {name: name, location: location}, {new: true})
        .then(res => {
            console.log(res);
        });
    res.redirect(`/campgrounds/${id}`);
}));

app.post('/campgrounds/new', catchAsync(async (req, res) => {
    let {name, image, price, description, location} = req.body;
    if (!name || !image || !price || !description || !location) throw new ExpressError(400, 'Incomplete new campground info');
    let newCampground = await Campground.create({name, image, price, description, location});
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.all('*', (req, res, next) =>  {
    next(new ExpressError(404, '404 Not Found'));
});

// Error handling
app.use((err, req, res, next) => {
    let {status = 500, message = 'Something is wrong. Though I do not know which one.'} = err;
    res.status(status).send(message);
});