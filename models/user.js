let mongoose = require('mongoose');
let {Schema} = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);