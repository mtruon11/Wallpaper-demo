const express = require('express');
const router = express.Router();

// Home page 
router.get('/', (req, res) => res.render('./home/index'));

//Shop page
router.get('/products', (req, res) => res.render('./home/products'));

//Sale
router.get('/onSale', (req, res) => res.render('./home/products'));

//Blog
router.get('/blog', (req, res) => res.render('./home/blog'));

//About
router.get('/about', (req, res) => res.render('./home/about'));

//Contact
router.get('/contact', (req, res) => res.render('./home/contact'));

module.exports = router;
