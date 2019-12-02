const express = require('express');
const router = express.Router();

//Load Product model
const Product = require('../../models/Product');
const Categories = require('../../models/Category');
const Tag = require('../../models/Tag');
const Color = require('../../models/Color');
const Measurement = require('../../models/Measurement');

//All Available Products
router.get('/', async (req, res) => {
    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

    await Product.countDocuments({}, (err, totalCount) => {
        if(err) {
            console.log("Error while counting total products");
        } else {
            Product.find({status: true}, null, query, (err, products) => {
                if(err){
                    console.log('Error while loading products');
                } else {
                    Categories.find({}, (err, categories) => {
                        if(err) {
                            console.log('Error while loading categories');
                        } else {
                            Tag.find({}, (err, tags) => {
                                if (err) {
                                    console.log('Error while loading tags');
                                } else {
                                    Color.find({}, (err, colors) => {
                                        if (err) {
                                            console.log('Error while loading colors');
                                        } else {
                                            Measurement.find({}, (err, measurements) => {
                                                if (err) {
                                                    console.log('Error while loading measurements');
                                                } else {
                                                    var totalPages = Math.ceil(totalCount / size);
                                                    res.status(200).render('./home/products', {
                                                        user: req.user,
                                                        products: products,
                                                        categories: categories,
                                                        tags: tags,
                                                        colors: colors,
                                                        measurements: measurements,
                                                        pages: totalPages,
                                                        currentPage: pageNum
                                                    })
                                                } 
                                            });               
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    })
});

//Specific Product
router.get('/id/:id', (req, res) => {

    Product.findById(req.params.id, (err, product) => {
        if(err) {
            console.log('Error while loading product')
        } else {
            Product.find({categories: product.categories}, (err, products) => {
                res.status(200).render('./home/product-detail', {
                    user: req.user,
                    relatedProducts: products,
                    product: product
                })
            })
        }
    });
});

//Sale
router.get('/onSale', async (req, res) => {

    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

    await Product.countDocuments({isSale: true}, (err, totalCount) => {
        if(err) {
            console.log("Error while counting total products");
        } else {
            Product.find({status: true, isSale: true}, null, query, (err, products) => {
                if(err){
                    console.log('Error while loading products'+ err);
                } else {
                    Categories.find({}, (err, categories) => {
                        if(err) {
                            console.log('Error while loading categories');
                        } else {
                            Tag.find({}, (err, tags) => {
                                if (err) {
                                    console.log('Error while loading tags');
                                } else {
                                    Color.find({}, (err, colors) => {
                                        if (err) {
                                            console.log('Error while loading colors');
                                        } else {
                                            Measurement.find({}, (err, measurements) => {
                                                if (err) {
                                                    console.log('Error while loading measurements');
                                                } else {
                                                    var totalPages = Math.ceil(totalCount / size);
                                                    res.status(200).render('./home/products', {
                                                        user: req.user,
                                                        products: products,
                                                        categories: categories,
                                                        tags: tags,
                                                        colors: colors,
                                                        measurements: measurements,
                                                        pages: totalPages,
                                                        currentPage: pageNum
                                                    })
                                                } 
                                            });               
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    })
});


module.exports = router;
