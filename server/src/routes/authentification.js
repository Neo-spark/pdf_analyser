const express = require('express');
const router = express.Router();
const {loginUser,registerUser,refreshAccessToken,logoutUser}=require('../controllers/authentification');

router.post('/login',loginUser);
router.post('/register',registerUser);
router.post('/refresh-token',refreshToken);
router.post('/logout',logoutUser);


module.exports=router;