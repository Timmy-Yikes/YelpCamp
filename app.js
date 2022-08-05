// import libs and application creating
let express = require('express');
let mongoose = require('mongoose');
let methodOverride = require('method-override');
let app = express();
let path = require('path');
let Campground = require('./models/campground');
let ejsMate = require('ejs-mate');
let AppError = require('./AppError');

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

// routing setting
app.get('/', (req, res) => {
    res.send('YelpCamp!');
});

app.get('/campgrounds', async (req, res) => {
    let cgs = await Campground.find({});
    if (cgs instanceof Error) return console.log('err on building cgs for index!');
    res.render('index', {cgs});
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
})

app.get('/campgrounds/:id', async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id);
    if (cg instanceof Error) return console.log('err on building cg for detail!');
    res.render('detail', {cg});
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id);
    if (cg instanceof Error) return console.log('err on building cg for editing!');
    res.render('edit', {cg});
});

app.put('/campgrounds/:id', async (req, res) => {
    let {id} = req.params;
    // console.log(req.params);
    // console.log(req.body);
    let {name, location} = req.body;
    Campground.findByIdAndUpdate(id, {name: name, location: location}, {new: true})
        .then(res => {
            console.log(res);
        });
    res.redirect(`/campgrounds/${id}`);
});

app.post('/campgrounds/new', async (req, res) => {
    let {name, location} = req.body;
    let newCampground = await Campground.create({name: name, location: location});
    res.redirect(`/campgrounds/${newCampground._id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.use((err, req, res, next) => {
    let {status = 500, message = 'Something is wrong. Though I do not know which one.'} = err;
    res.status(status).send(message);
})