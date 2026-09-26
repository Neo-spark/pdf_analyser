const mongoose=require('mongoose');

const URL=process.env.MONGO_URI;

const connectDB=async()=>
{
    try
    {
        await mongoose.connect(URL);
        console.log("MongoDB connected successfully");
    }
    catch(error)
    {
        console.log("Error while connecting to MongoDB",error);
        process.exit(1);    //exit the process with failure
    }
};

module.exports=connectDB;