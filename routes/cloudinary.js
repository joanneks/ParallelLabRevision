const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
// configure cloudinary
cloudinary.config({
    'api_key':process.env.CLOUDINARY_API_KEY,
    'api_secret':process.env.CLOUDINARY_API_SECRET
})

router.get('/sign',async function(req,res){
    const params_to_sign = JSON.parse(req.query.params_to_sign)
    //retrieve the api secret
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    //get the signature(aka from cloudinary)
    const signature = cloudinary.utils.api_sign_request(params_to_sign,apiSecret);

    // send back signature to cloudinary widget
    res.send(signature);
})

module.exports = router;