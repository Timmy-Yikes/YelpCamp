// Individual Joi helpers to validate single documents of different models
let BaseJoi = require('joi');
let sanitizeHTML = require('sanitize-html');

let extension = (joi) => {
    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': '{{#label}} must not include HTML!'
        },
        rules: {
            escapeHTML: {
                validate(value, helpers) {
                    let clean = sanitizeHTML(value, {
                        allowedTags: [],
                        allowedAttributes: {}
                    });
                    if (clean !== value) return helpers.error('string.escapeHTML');
                    return clean;
                }
            }
        }
    }
}

let Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    images: Joi.array().items(Joi.object({
        url: Joi.string(),
        filename: Joi.string()
    })),
    price: Joi.number().min(0).required(),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    geometry: Joi.array(),
    author: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    text: Joi.string().required().escapeHTML(),
    rating: Joi.number().min(0).max(5).required(),
    campground: [
        Joi.string(),
        Joi.number()
    ],
    author: Joi.string().required()
})

module.exports.userSchema = Joi.object({
    username: Joi.string().min(3).required().escapeHTML(),
    email: Joi.string().email(),
    password: Joi.string().min(8).required().escapeHTML(),
    repeat_password: Joi.ref('password'),
});