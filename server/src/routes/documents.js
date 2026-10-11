const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');
const { uploadDocument,downloadDocument,viewFiles } = require('../controllers/document');

router.post('/upload',authMiddleware,upload,uploadDocument);
router.get('/download/:id',authMiddleware,downloadDocument);
router.get('/files',authMiddleware,viewFiles);
module.exports = router;
