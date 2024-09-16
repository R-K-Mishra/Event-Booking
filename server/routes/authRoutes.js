const express = require('express');
const router = express.Router();

const { 
    signup, 
    signin, 
    forgotPassword, 
    resetPassword, 
    emailVerification, 
    userDetails, 
    deleteAccount 
} = require('../controllers/authController');

const { auth } = require('../middlewares/auth');

// USER ROUTES

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/forgot-password', forgotPassword);

router.post('/email-verification', emailVerification);

router.post('/reset-password', resetPassword);

router.get('/user-details', auth, userDetails);

router.delete('/delete-account', auth, deleteAccount);

// ADMIN ROUTES

// router.post('/admin/delete-user', auth, )

module.exports = router;