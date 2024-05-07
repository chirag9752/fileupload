// Note : bussiness logic ham models ke andar bhi rakh sakte hai
const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// local fileupload -> handler function  -> ye sirf server ke andar ek location pe file upload karega
// expressfileupload docu me dekh lo browser me jaake
// NOte : Jab bhi ham postman ke threw koi bhi file upload karte hai tab pehle ham file ka path set karte hai setting me jaake ki kaha h hamari file 

exports.localFileUpload = async(req , res) =>{
    try{
        //  fetch files
        const file = req.files.file;  // req.files.file this hirearchy is used when you fetched files we cant do destructuring in this case
        console.log("Files aayegi " , file);

        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;   // create path where file need to be stored on server
        // __dirname -> shows current directory i.e. controllers currently
        console.log("path:-> " , path);


        file.mv(path , (err) => {
             console.log(err);
        });  // file upload karne ke liye move function required hai , here we add path to move function , undefined aayega kyuki error hai hi nhi 

        res.json({
            success : true,
            message : 'Local File Uploaded Successfully',
        })

    }catch(error){
        console.log(error);
    }

}

function ifFileSupported(Type , supportedTypes){
    return supportedTypes.includes(Type);
}


// async function uploadFileToCloudinary(file , folder){
    
//     const options = {folder};
//     console.log("temp file path" , file.tempFilePath);
//     options.resource_type = "auto";                          // incase of video upload it required
//     return await cloudinary.uploader.upload(file.tempFilePath , options);
// }


// image upload ka handler

exports.imageUpload = async (req , res) =>{
    try{
    //    data fetchkarlo
    const {name , tags , email} = req.body;
    console.log(name , tags , email);

    const file = req.files.imageFile;
    console.log(file);

    // validation
    const supportedTypes = ["jpg" , "jpeg" , "png"];
    
    const fileType = file.name.split('.')[1].toLowerCase();
    console.log("filte type :-> ", fileType);

    if(!ifFileSupported(fileType , supportedTypes) )
    {
        return res.status(400).json({
            success : false,
            message : 'File Formate not supported'
        })
    }

    // file formate supported hai then we upload our files to cloudinary
    
    console.log("Uploading to Codehelp");
    const response = await uploadFileToCloudinary(file , "codehelp");
    console.log(response);

    // upload on db

    const fileData = await File.create({
        name,
        tags,
        email,
        imageUrl : response.secure_url,
    })

    res.json({
        success : true,
        imageUrl : response.secure_url,
        message : 'Image Successfully Uploaded',
    })

    }catch(error){
        console.error(error);
        res.status(400).json({
            success : false,
            message : 'Something went wrong',
        })
    }
}


exports.videoUpload = async(req , res) =>{
    try{
      
        // fetch data
      const {name , tags , email} = req.body;
      console.log(name , tags , email);

      const file = req.files.videoFile;
      
    //   validation
    const supportedFiles = ["mp4" , "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("File Types" , fileType);
    
    // Add a uper limit to 5mb for video
    if(!ifFileSupported(fileType , supportedFiles)){
         return res.status(400).json({
            success : false,
            message : 'File formate not supported',
         })
    }

    // file formate supported hai thats why uploadd to cloudinary
    
    console.log("Uploading to codehelp");
    const response = await uploadFileToCloudinary(file , "codehelp");
    console.log(response);

    // db me entry

    const fileData = await File.create({
        name, 
        tags, 
        email, 
        imageUrl : response.secure_url
    })

    res.json({
        success : true,
        imageUrl : response.secure_url,
        message : "video uploaded successfully"
    })

    }catch(error){
        console.error(error);
       res.status(400).json({
          success : false,
          message : 'Something went wrong',
       })
    }
}


// we create this function by copy uper wala because uper wala or ye same same hora thh
async function uploadFileToCloudinary(file , folder , quality){
    
    const options = {folder};
    console.log("temp file path" , file.tempFilePath);

    if(quality)
    {
        options.quality = quality;
    }
    options.resource_type = "auto";                          // incase of video upload it required
    return await cloudinary.uploader.upload(file.tempFilePath , options);
}


// threw this handler whole size of image decrease
exports.imageSizeReducer = async(req , res) =>{
    try{
        //    data fetchkarlo
        const {name , tags , email} = req.body;
        console.log(name , tags , email);
    
        const file = req.files.imageFile;
        console.log(file);
    
        // validation
        const supportedTypes = ["jpg" , "jpeg" , "png"];
        
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("filte type :-> ", fileType);
    
        if(!ifFileSupported(fileType , supportedTypes) )
        {
            return res.status(400).json({
                success : false,
                message : 'File Formate not supported'
            })
        }
    
        // file formate supported hai then we upload our files to cloudinary
        
        console.log("Uploading to Codehelp");
        const response = await uploadFileToCloudinary(file , "codehelp" , 30);
        console.log(response);
    
        // upload on db
    
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl : response.secure_url,
        })
    
        res.json({
            success : true,
            imageUrl : response.secure_url,
            message : 'Image Successfully Uploaded',
        })
    
        }catch(error){
            console.error(error);
            res.status(400).json({
                success : false,
                message : 'Something went wrong',
            })
        }
}