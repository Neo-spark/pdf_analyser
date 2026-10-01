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
                resource_type:"auto"
            }
        );
        console.log("FILE UPLOADED SUCCESSFULLY ON CLOUDINARY",result.secure_url);
        try {
            fs.unlinkSync(filepath);
        } catch (cleanupError) {
            console.error("Unable to remove temporary upload", cleanupError);
        }
        return result.secure_url;

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