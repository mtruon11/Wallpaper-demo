const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth")
const ensureLog = require("connect-ensure-login")
// Home page 
router.get('/', (req, res) => res.render('index'));

//Shop page
router.get('/products', (req, res) => res.render('products'));

//Sale
router.get('/onSale', (req, res) => res.render('products'));

//Blog
router.get('/blog', (req, res) => res.render('blog'));

//About
router.get('/about', (req, res) => res.render('about'));

//Contact
router.get('/contact', (req, res) => res.render('contact'));

router.get('/admin', ensureLog.ensureLoggedIn("/users/login"), (req, res) => 
    res.render('dashboard', {
        user: req.user
    })
)

module.exports = router;
