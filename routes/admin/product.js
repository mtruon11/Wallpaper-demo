const express = require('express');
const router = express.Router();
const {uploadProduct, uploadForUser, uploadForVendor} = require('../upload');
const csrf = require('csurf');

const csrfProtection = csrf({cookie:true});

// Load Product model
const Product = require('../../models/Product');

module.exports = router;

router.get('/', (req, res) => {
    
    Product.find({}, async (err,data) => {
        if(data){

            var total;
            var outOfStock;

            await Product
                .countDocuments({}, (err, count) => {
                    total = count;
                });

            await Product
                .countDocuments({status: false, quantity: {$eq: 0}}, (err, count) => {
                    outOfStock = count;
                });

            res.status(200).render('./admin/viewProduct', {
                user: req.user, 
                total: total,
                outOfStock: outOfStock,
                data: data,
                link: "/admin/product/"
            })
        } else {
            res.status(200).render('./admin/viewProduct', {
                user: req.user, 
                total: 0,
                outOfStock: 0,
                data: null,
                link: "/admin/product/"
            })
        }
    });
});

router.delete('/:sku', (req, res) => {
    
    Product.deleteOne({sku: req.params.sku}, (err, product) => {
        if(err) {
            console.log('Error while deleting product');
        } else {
            console.log(req.params.sku + ' Product deleted');
            res.redirect('/admin/product');
        }
    });
});


router.get('/addProduct', csrfProtection, async (req, res) => {
    var total;
    var outOfStock;

    await Product
        .countDocuments({status: false, quantity: {$eq: 0}}, (err, count) => {
            outOfStock = count;
        });
    
    await Product
        .countDocuments({}, (err, count) => {
            total = count;
        });

    res.status(200).render('./admin/productForm', {
        user: req.user, 
        total: total,
        outOfStock: outOfStock,
        csrfToken: req.csrfToken()
    })
});

router.post('/addProduct', uploadProduct.array('images'), csrfProtection, async (req, res) => {
    const {sku, name, description, quantity, regularPrice, 
        discountPrice, tags, categories, colors, measure} = req.body;
    const images = req.files;
    let errors = [];
    let imageUrl = [];

    if(!sku || !name || !quantity || !regularPrice || !discountPrice 
        || !tags || !categories || !colors || !measure) {
            errors.push({msg: 'Please enter all fields.'});
    }

    if(images.length == 0){
        errors.push({msg: 'Please upload at least 1 image.'});
    }

    if(quantity <= 0 || regularPrice <= 0 || discountPrice <= 0){
        errors.push({msg: 'Quantity, regular price, and discount price must be greater than 0.'});
    }

            
    var total;
    var outOfStock;

    await Product
        .countDocuments({status: false, quantity: {$eq: 0}}, (err, count) => {
            outOfStock = count;
        });
    
    await Product
        .countDocuments({}, (err, count) => {
            total = count;
        });

    if(errors.length > 0) {
        res.status(404).render('./admin/productForm', {
            errors, sku, name, description, quantity, regularPrice, discountPrice, tags,
            categories, colors, measure, imageUrl, total: total, outOfStock: outOfStock, csrfToken: req.csrfToken()
        });
    } else {
        Product.findOne({sku: sku}).then(product => {
            if(product){
                errors.push({msg: 'Product already existed.'});
                res.status(200).render('./admin/productForm', {
                    user: req.user, 
                    errors, sku, name, description, quantity, regularPrice, discountPrice, tags, 
                    categories, colors, measure, imageUrl, total: total, outOfStock: outOfStock, csrfToken: req.csrfToken() 
                });
            } else {

                for(var idx in images){
                    imageUrl.push('http://ec2-35-173-191-97.compute-1.amazonaws.com/images/uploads/' + images[idx].originalname);
                }
                
                const newProduct = new Product({
                    sku, name, description, quantity, regularPrice,
                    discountPrice, tags, categories, colors, measure, imageUrl
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

router.get('/:sku', csrfProtection, (req, res) => {

    Product.findOne({sku: req.params.sku}, async (err, product) => {
        var total;
        var outOfStock;
    
        await Product
            .countDocuments({}, (err, count) => {
                total = count;
            });
    
        await Product
            .countDocuments({status: false, quantity: {$eq: 0}}, (err, count) => {
                outOfStock = count;
            });   
    
        res.render('./admin/editProduct', {
            user: req.user, 
            total: total,
            outOfStock: outOfStock, 
            product: product,
            csrfToken: req.csrfToken()
        });
    });
    
});

router.post('/editProduct', uploadProduct.array('images'), csrfProtection, (req, res) => {
    const {sku, name, description, quantity, regularPrice, 
        discountPrice, tags, categories, colors, measure} = req.body;
    const images = req.files;
    let errors = [];
    let imageUrl = [];

    if(!sku || !name || !quantity || !regularPrice || !discountPrice 
        || !tags || !categories || !colors || !measure ) {
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
            discountPrice, tags, categories, colors, measure, imageUrl 
        });
        res.status(404).render('./admin/editProduct', {
            user: req.user, 
            errors, product, csrfToken: req.csrfToken()
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
                discountPrice:discountPrice, tags:tags, categories:categories, colors: colors,
                measure: measure, imageUrl:imageUrl
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
});
