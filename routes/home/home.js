const express = require('express');
const router = express.Router();

const Product = require('../../models/Product');

// Home page 
router.get('/', (req, res) => {
    Product.find({status:true}, (err, products) => {
        res.render('./home/index', {
            user: req.user,
            products: products
        })
    })
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

//Subscribe
router.post('/subscribe', (req, res) => {
	console.log('Email: ' + req.query.email);
	res.status(200).redirect('/');
});


module.exports = router;
