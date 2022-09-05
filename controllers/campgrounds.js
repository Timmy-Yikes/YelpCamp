const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.getIndex = async (req, res) => {
    let cgs = await Campground.find({});
    res.render('index', {cgs});
}

module.exports.renderNewForm = (req, res) => {
    res.render('new');
}

module.exports.getDetail = async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id).
    populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).
    populate('author');
    if (!cg) {
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campgrounds');
    }
    res.render('detail', {cg});
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let cg = await Campground.findById(id);
    res.render('edit', {cg});
}

module.exports.putEditForm = async (req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body, {new: true});
    req.flash('success', 'Campground successfully updated!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.postNewForm = async (req, res) => {
    let cg = await Campground.create(req.body);
    cg.images = req.files.map(image => ({
            url: image.path,
            filename: image.filename
        })
    );
    await cg.save();
    req.flash('success', 'New campground successfully created!');
    res.redirect(`/campgrounds/${cg._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    let {id} = req.params;
    await Review.deleteMany({campground: id});
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground successfully deleted!');
    res.redirect('/campgrounds');
}