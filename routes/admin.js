const express = require('express');
const router = express.Router();
const ensureLog = require("connect-ensure-login")
const upload = require('./upload');



// Load User model
const Product = require('../models/Product');

router.get('/', ensureLog.ensureLoggedIn("/users/login"), (req, res) => 
    res.render('dashboard', {
        user: req.user
    })
);

router.get('/addProduct', ensureLog.ensureLoggedIn("/users/login"), (req, res) => 
    res.render('dashboard', {
        user: req.user
    })
);

router.post('/addProduct', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {
    upload(req, res, function(err) {
        console.log(req.body.categories);
        console.log(req.files);
        // const {sku, name, description, quantity, regularPrice, 
        //     discountPrice, tags, categories, images} = req.body;
        // let errors = [];
        
        // if(!sku || !name || !quantity || !regularPrice || !discountPrice 
        //     || !tags || ! categories || !images ) {
        //         console.log(req.body);
        //         errors.push({msg: 'Please enter all fields'});
        // }
    
        // if(quantity <= 0 || regularPrice <= 0 || discountPrice <= 0){
        //     errors.push({msg: 'Must be greater than 0'});
        // }
    
        // if(errors.length > 0) {
        //     res.render('dashboard', {
        //         errors,
        //         sku, name, description, quantity, regularPrice, 
        //         discountPrice, tags, categories, images
        //     });
        // } else {
        //     if(err) {
        //         errors.push({msg: 'Error uploading file. Try again.'});
        //     } else {
        //         console.log('File uploaded.');
        //         console.log(req.body);
        //         console.log(req.files);
        //         const newProduct = new Product({
        //             sku, name, description, quantity, regularPrice, 
        //             discountPrice, tags, categories, images
        //         });

        //         newProduct
        //             .save()
        //             .then(product => {
        //                 req.flash(
        //                     'success:msg',
        //                     'New product is created.'
        //                 )
        //                 console.log('New product is created.')
        //                 res.redirect('/admin')
        //             })
        //             .catch(err => console.log(err));
        //     }
        // }
    })     
});


module.exports = router;