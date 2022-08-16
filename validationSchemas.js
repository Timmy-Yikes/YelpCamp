// Individual Joi helpers to validating single documents of different models
let Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().required(),
    location: Joi.string().required()
});

module.exports.reviewSchema = Joi.object({
    text: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required(),
    campground: [
        Joi.string(),
        Joi.number()
    ]
})