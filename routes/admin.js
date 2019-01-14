const express = require('express');
const router = express.Router();
const ensureLog = require("connect-ensure-login")
const upload = require('./upload');

// Load User model
const Product = require('../models/Product');

router.get('/', ensureLog.ensureLoggedIn("/users/login"), (req, res) => 
    res.status(200).render('./admin/dashboard', {
        user: req.user
    })
);

router.get('/product', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {
    
    Product.find({}, async (err,data) => {
        if(data){

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

            res.status(200).render('./admin/viewProduct', {
                user: req.user,
                total: total,
                onStock: onStock,
                outOfStock: outOfStock,
                data: data,
                link: "/admin/product/"
            })
        }
    });
});

router.get('/product/addProduct', ensureLog.ensureLoggedIn("/users/login"), async (req, res) => {
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

router.post('/product/addProduct', ensureLog.ensureLoggedIn("/users/login"), upload.array('images'), async (req, res) => {
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
        res.status(404).render('./admin/productForm', {
            errors, sku, name, description, quantity, regularPrice, 
            discountPrice, tags, categories, imageUrl
        });
    } else {
        Product.findOne({sku: sku}).then(product => {
            if(product){
                errors.push({msg: 'Product already existed.'});
                res.status(200).render('./admin/productForm', {
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
                    res.redirect('/admin/product/addProduct')
                })
                .catch(err => console.log(err));
            }
        })
    }
});

router.delete('/product/:sku', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {
    
    Product.deleteOne({sku: req.params.sku}, (err, product) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.sku + ' Product deleted');
            res.redirect('/admin/product');
        }
    });
});

router.get('/product/:sku', ensureLog.ensureLoggedIn("/users/login"), (req, res) => {

    Product.findOne({sku: req.params.sku}, async (err, product) => {
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
    
        res.render('./admin/editProduct', {
            user: req.user,
            total: total,
            onStock: onStock,
            outOfStock: outOfStock, 
            product: product
        });
    });
    
});

router.post('/product/editProduct', ensureLog.ensureLoggedIn("/users/login"), upload.array('images'), (req, res) => {
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
        const product = new Product({
            sku, name, description, quantity, regularPrice,
            discountPrice, tags, categories, imageUrl
        });
        res.status(404).render('./admin/editProduct', {
            errors, product
        });
    } else {
        for(var idx in images){
            imageUrl.push(images[idx].path);
        }
        Product.findOneAndUpdate(
            {
                sku: sku
            },
            {
                name: name, description: description, quantity:quantity, regularPrice:regularPrice,
                discountPrice:discountPrice, tags:tags, categories:categories, imageUrl:imageUrl
            },
            {
                upsert:true
            }, 
            (err, product) => {
                if(err){
                    console.log('error while updating');
                    return;
                }
                res.redirect('/admin/product/');
            });
    }
})


module.exports = router;