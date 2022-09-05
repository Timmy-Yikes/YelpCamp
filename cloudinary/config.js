let cloudinary = require('cloudinary').v2;
let {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

let storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['png', 'jpg', 'jpeg', 'bmp']
    }
});

module.exports.cloudinary = cloudinary;
module.exports.storage = storage;