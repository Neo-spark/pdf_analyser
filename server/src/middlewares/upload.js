const multer = require('multer');
//const path = require('path');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const isPdf =
		file.mimetype === 'application/pdf' &&
		path.extname(file.originalname).toLowerCase() === '.pdf';

	if (isPdf) {
		return cb(null, true);
	}

	cb(new Error('Only PDF files are allowed'));
};

module.exports = multer({
	storage,
	fileFilter,
});
