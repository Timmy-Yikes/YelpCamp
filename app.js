let express = require('express');
let mongoose = require('mongoose');
let methodOverride = require('method-override');
let app = express();
let path = require('path');
let Campground = require('./models/campground');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.listen('3000', () => {
    console.log('Listening on port 3000!');
});
mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => {
        console.log('MongoDB connected!');
    })
    .catch((err) => {
        console.log('MongoDB connecting failed!');
        console.log(err);
    });

app.get('/', (req, res) => {
    res.send('YelpCamp!');
});

