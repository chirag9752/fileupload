const cloudinary = require("cloudinary").v2;    // .v2 for version 2  and npm i cloudinary for using cloudinary

require("dotenv").config();

exports.cloudinaryConnect = () =>{
    try{
         cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key :    process.env.API_KEY,
            api_secret : process.env.API_SECRET,
         }) // Used to estabilshed connection and we have to define 3 things  cloudname , apikey , secret
    }
    catch(error){
       console.log(error);
    }
}