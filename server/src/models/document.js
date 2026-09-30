const mongoose = require('mongoose');
const documentSchema=new mongoose.Schema({
   userId:
   {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
   },
   filename:
   {
    type:String,
   required:true,
    trim:true
   },
   storageKey:
   {
    type:String,
    required:true,
    trim:true
   },
   mimetype:
   {
    type:String,
    required:true,
    trim:true
   },
   fileSize:
   {
    type:Number,
    required:true
   },
   status:
   {
    type:String,
    enum:['pending','approved','rejected'],
    default:'pending'   
   },
   pagecount:
   {
    type:Number,
    required:true
   },
   createdAt:
   {
    type:Date,
    default:Date.now
   }

});

document=mongoose.model('Document',documentSchema);

module.exports=document;