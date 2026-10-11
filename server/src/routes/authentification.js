const express = require('express');
const router = express.Router();
const {
	login,
	register,
	refreshToken,
	logoutUser
} = require('../controllers/authentification');
const authMiddleware = require('../middlewares/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);
//router.use(authMiddleware);


module.exports=router;