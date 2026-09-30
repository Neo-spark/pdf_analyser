const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/fileUpload');
const { uploadDocument } = require('../controllers/document');

router.post('/upload',authMiddleware,upload,uploadDocument);

module.exports = router;
