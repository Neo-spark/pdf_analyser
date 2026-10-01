
const Document = require('../models/document');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const dropbox = require('../utils/dropbox');

const uploadDocument = async (req, res) => {
    let filepath;
    let storageKey;
    let uploadedToDropbox = false;

    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Authenticated user is required' });
        }

        if(!req.file){
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalname, mimetype, size } = req.file;
        filepath = req.file.path;
        const safeFilename = path.basename(originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
        storageKey = `/documents/${req.user.id}/${Date.now()}-${crypto.randomUUID()}-${safeFilename}`;
        const fileData = await fs.readFile(filepath);

        await dropbox.filesUpload({
            path: storageKey,
            contents: fileData,
            mode: { '.tag': 'add' },
            autorename: false,
            mute: true,
        });
        uploadedToDropbox = true;

        const newDocument = new Document({
            userId: req.user.id,
            filename: originalname,
            storageKey,
            mimetype,
            fileSize: size,
            pagecount: 0,
        });
        await newDocument.save();

        return res.status(201).json({
            message: 'File uploaded successfully',
            document: newDocument,
            url: `/documents/download/${newDocument._id}`,
        });
    } catch (error) {
        console.error('Error uploading document:', error);
        if (uploadedToDropbox) {
            await dropbox.filesDeleteV2({ path: storageKey }).catch((cleanupError) => {
                console.error('Unable to remove orphaned Dropbox upload', cleanupError);
            });
        }
        return res.status(500).json({ error: 'Internal server error' });    
    } finally {
        if (filepath) {
            await fs.unlink(filepath).catch((cleanupError) => {
                console.error('Unable to remove temporary upload', cleanupError);
            });
        }
    }
};

const downloadDocument = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        if (!document.storageKey) {
            return res.status(410).json({ error: 'Document is not stored in Dropbox' });
        }

        const download = await dropbox.filesDownload({ path: document.storageKey });
        const fileBuffer = Buffer.from(download.result.fileBinary);
        res.set({
            'Content-Type': document.mimetype,
            'Content-Length': fileBuffer.length,
            'Content-Disposition': `inline; filename="${document.filename.replace(/"/g, '')}"`,
        });
        return res.end(fileBuffer);
    } catch (error) {
        console.error('Error downloading document:', error);
        if (error?.status === 409) {
            return res.status(404).json({ error: 'File not found in Dropbox' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};



//view all files
const viewFiles = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({error:'Authenticated user is required'});
        }
        const documents = await Document.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({ message: 'Documents fetched successfully', documents });
    } catch (error) {
        console.error('Error fetching documents:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { uploadDocument, downloadDocument, viewFiles };