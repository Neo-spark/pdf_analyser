const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination:(req,file,cb)=>
	{
		cb(null, path.join(__dirname, '../../uploads'));
	}
});

const fileFilter = (req, file, cb) => {
	const isPdf =
		file.mimetype === 'application/pdf' &&
		path.extname(file.originalname).toLowerCase() === '.pdf';

	if (isPdf) {
		return cb(null, true);
	}

	cb(new Error('Only PDF files are allowed'));
};

const upload = multer({
	storage,
	fileFilter,
});
module.exports = upload.single('file');
