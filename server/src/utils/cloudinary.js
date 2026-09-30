const  { v2: cloudinary } =require( "cloudinary");
const fs=require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//upload on cloudinary
const uploadOnCloudinary = async (filepath)=>
{
    try{
        if(!filepath) return null;
        const result=await cloudinary.uploader.upload(filepath,
            {
                filetype:"auto"
            }
        )
        console.log("FILE UPLOADE SUCCESSFULLY ON CLOUDINARY",result.url);
        return result.url;

    }
    catch(err)
    {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        return null;
    }
};


module.exports={uploadOnCloudinary, cloudinary};