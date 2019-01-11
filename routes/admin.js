const express = require('express');
const router = express.Router();
const ensureLog = require("connect-ensure-login")
const upload = require('./upload');
const async = require('async');

// Load User model
const Product = require('../models/Product');

router.get('/', ensureLog.ensureLoggedIn("/users/login"), (req, res) => 
    res.render('./admin/dashboard', {
        user: req.user
    })
);

router.get('/addProduct', ensureLog.ensureLoggedIn("/users/login"), async (req, res) => {
    var total;
    var onStock;
    var outOfStock;

    await Product
        .countDocuments({}, (err, count) => {
            total = count;
        });
        
    await Product
        .countDocuments({quantity: {$gt: 0}}, (err, count) => {
            onStock = count;
        });

    await Product
        .countDocuments({quantity: {$eq: 0}}, (err, count) => {
            outOfStock = count;
        });

    res.status(200).render('./admin/productForm', {
        user: req.user,
        total: total,
        onStock: onStock,
        outOfStock: outOfStock
    })
});


router.post('/addProduct', ensureLog.ensureLoggedIn("/users/login"), upload.array('images'), (req, res) => {

    const {sku, name, description, quantity, regularPrice, 
        discountPrice, tags, categories} = req.body;
    const images = req.files;
    let errors = [];
    let imageUrl = [];

    if(!sku || !name || !quantity || !regularPrice || !discountPrice 
        || !tags || !categories ) {
            errors.push({msg: 'Please enter all fields.'});
    }

    if(images.length == 0){
        errors.push({msg: 'Please upload at least 1 image.'});
    }

    if(quantity <= 0 || regularPrice <= 0 || discountPrice <= 0){
        errors.push({msg: 'Quantity, regular price, and discount price must be greater than 0.'});
    }

    if(errors.length > 0) {
        res.render('./admin/productForm', {
            errors, sku, name, description, quantity, regularPrice, 
            discountPrice, tags, categories, imageUrl
        });
    } else {
        Product.findOne({sku: sku}).then(product => {
            if(product){
                errors.push({msg: 'Product already existed.'});
                res.render('./admin/productForm', {
                    errors, sku, name, description, quantity, regularPrice,
                    discountPrice, tags, categories, imageUrl
                });
            } else {

                for(var idx in images){
                    imageUrl.push(images[idx].path);
                }
                
                const newProduct = new Product({
                    sku, name, description, quantity, regularPrice,
                    discountPrice, tags, categories, imageUrl
                });

                newProduct
                .save()
                .then(product => {
                    console.log('Product created.')
                    req.flash(
                        'success_msg',
                        'New product is created.'
                    )
                    res.redirect('/admin/addProduct')
                })
                .catch(err => console.log(err));
            }
        })
    }
});


module.exports = router;