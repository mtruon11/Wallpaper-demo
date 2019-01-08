const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');

// Load User model
const User = require('../models/User');

router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        user: req.user
    })
);

module.exports = router;