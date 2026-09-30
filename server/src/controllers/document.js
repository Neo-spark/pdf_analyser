
const Document = require('../models/document');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { uploadOnCloudinary } = require('../utils/cloudinary');

const uploadDocument=async(req,res)=>
{
    try{
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Authenticated user is required' });
        }

        if(!req.file){
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(req.file);
        const { originalname, mimetype, size, path: filepath } = req.file;
        const newDocument = new Document({
            userId: req.user.id,
            filename: originalname,
            storageKey: filepath,
            mimetype,
            fileSize: size,
            pagecount: 0, // Initialize page count to 0
        });
        await newDocument.save();
        return res.status(201).json({

            message: 'File uploaded successfully',
            document: newDocument,
        });
    } catch (error) {
        console.error('Error uploading document:', error);
        return res.status(500).json({ error: 'Internal server error' });    
    }
};

module.exports = { uploadDocument };