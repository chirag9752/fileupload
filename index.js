const express = require("express");
const app = express();


require("dotenv").config();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// expresss ke pass file se interact karne ke liye koi tarika hai nhii that why we used here 3rd party packges like express-fileupload , multer etc
// search npm express fileuplaod  in browrser for better understanding
// in terminal -> npm i express-fileupload
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp'
 }));      // we use this middleware to upload files in server


// we have 2 upload methods 1.> cloudinary wala , 2.> fileupload wala
// fileupload wala server pe upload karta hai files ko
// cloudniary wala mediaserver pe upload karta hai


// connect with  db
const db = require("./config/database");
db.connect();

// connect with cloud
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// api route mount karna hai

const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload" , Upload);


// activate server
app.listen(PORT , () =>{
    console.log(`App is running at ${PORT}`);
})