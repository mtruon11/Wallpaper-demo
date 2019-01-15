const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureLog = require('connect-ensure-login');

// Login Page
router.get('/login', ensureLog.ensureLoggedOut('/'), (req, res) => res.render('./admin/login'));

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successReturnToOrRedirect: '/admin',
        failureRedirect: '/employees/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/employees/login');
});

module.exports = router;
