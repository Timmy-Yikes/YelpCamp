const Campground = require("../models/campground");
const Review = require("../models/review");
let {cloudinary} = require('../cloudinary/config');
let mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let geocodingService = mbxGeocoding({accessToken: process.env.MAPBOX_TOKEN});

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
    console.log(req.body)
    let cg = await Campground.findByIdAndUpdate(id, req.body, {new: true});
    cg.images.push(...(req.files.map(image => ({
            url: image.path,
            filename: image.filename
        })
    )));
    await cg.save();
    if (req.body.deleteImages) {
        for (let img of req.body.deleteImages) {
            await cloudinary.uploader.destroy(img);
        }
        await cg.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Campground successfully updated!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.postNewForm = async (req, res) => {
    let data = await geocodingService.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    let cg = new Campground(req.body);
    cg.geometry = data.body.features[0].geometry;
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