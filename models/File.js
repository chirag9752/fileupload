const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    imageUrl : {
        type : String,
    },
    tags : {
        type : String,
    },
    email : {
        type : String,
    }
});
 
// Post middleware 
// Note : this we make always before export of mongoose.model() 
// post middleware execute just after db entry and pre execute just before db entry


fileSchema.post("save" , async function(doc) {
    try{
         console.log("DOC" , doc);
         
        //  step 1  create transporter

        let transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // let transporter = require("../config/transporter");
        // transporter.Transporter();

        // send mail

        let info = await transporter.sendMail({
            from : `codehelp - by babbar`,
            to :  doc.email,
            subject : 'New file uploaded on Cloudinary',
            html : `<h2> Hello jee</h2> <p>File Uploaded</p> View here : <a href = "${doc.imageUrl}">${doc.imageUrl}</a>}`,
        })

        console.log("INFO" , info);



    }
    catch(error){
        console.error(error);
    }
})







// 2nd way to exports
const File = mongoose.model("File" , fileSchema);
module.exports = File;