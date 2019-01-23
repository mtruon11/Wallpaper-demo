const express = require('express');
const router = express.Router();

// Home page 
router.get('/', (req, res) => {
    res.render('./home/index', {user: req.user})
});

//Blog
router.get('/blog', (req, res) => {
    res.render('./home/blog', {user: req.user})
});

//About
router.get('/about', (req, res) => { 
    res.render('./home/about', {user: req.user})
});

//Contact
router.get('/contact', (req, res) => {
    res.render('./home/contact', {user: req.user})
});


module.exports = router;
