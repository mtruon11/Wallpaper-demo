const express = require('express');
const router = express.Router();
const ensureLog = require("connect-ensure-login")

// Load User model
const Product = require('../models/Product');

router.get('/', ensureLog.ensureLoggedIn("/users/login"), (req, res) => 
    res.render('dashboard', {
        user: req.user
    })
);

router.post('/addProduct', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {
    const {sku, name, description, quantity, regularPrice, 
        discountPrice, tags, categories, imageUrl} = req.body;
    let errors = [];
    
    if(!sku || !name || !quantity || !regularPrice || !discountPrice 
        || !tags || ! categories || !imageUrl ) {
            console.log(sku);
            console.log(name);
            console.log(quantity);
            console.log(regularPrice);
            console.log(discountPrice);
            console.log(tags);
            console.log(categories);
            console.log(imageUrl);
            errors.push({msg: 'Please enter all fields'});
    }

    if(quantity <= 0 || regularPrice <= 0 || discountPrice <= 0){
        errors.push({msg: 'Must be greater than 0'});
    }

    if(errors.length > 0) {
        res.render('dashboard', {
            errors,
            sku, name, description, quantity, regularPrice, 
            discountPrice, tags, categories, imageUrl
        });
    } else {
        const newProduct = new Product({
            sku, name, description, quantity, regularPrice, 
            discountPrice, tags, categories, imageUrl
        });

        newProduct
            .save()
            .then(product => {
                req.flash(
                    'success:msg',
                    'New product is created.'
                )
                res.redirect('/')
            })
            .catch(err => console.log(err));
    }
});


module.exports = router;