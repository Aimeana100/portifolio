const cloudinary = require('cloudinary').v2
const cloudiaryConfig = {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(cloudiaryConfig);
module.exports = cloudinary