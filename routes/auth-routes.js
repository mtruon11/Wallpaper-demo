const express = require('express');
const router = express.Router();
const passport = require('passport');

// Facebook 
router.get('/facebook', passport.authenticate('facebook', {scope:"email"}));
router.get('/facebook/callback', passport.authenticate('facebook', { 
    successReturnToOrRedirect: '/', 
    failureRedirect: '/users/login' 
  })
);

// Google
router.get('/google', passport.authenticate('google', {scope:"email"}));
router.get('/google/callback', passport.authenticate('google', { 
    successReturnToOrRedirect: '/', 
    failureRedirect: '/users/login' 
  })
);

module.exports = router;