let Joi = require('joi');
module.exports.campgroundSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().positive().required(),
    description: Joi.string().required(),
    location: Joi.string().required()
});