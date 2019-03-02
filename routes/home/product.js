const express = require('express');
const router = express.Router();

//Load Product model
const Product = require('../../models/Product');
const Categories = require('../../models/Category');
const Tag = require('../../models/Tag');

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
                                    var totalPages = Math.ceil(totalCount / size);
                                    res.status(200).render('./home/products', {
                                        user: req.user,
                                        products: products,
                                        categories: categories,
                                        tags: tags,
                                        pages: totalPages,
                                        currentPage: pageNum
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }
    })
    

});

//Specific Product
router.get('/pid/:id', (req, res) => {

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
                                    var totalPages = Math.ceil(totalCount / size);
                                    res.status(200).render('./home/products', {
                                        user: req.user,
                                        products: products,
                                        categories: categories,
                                        tags: tags,
                                        pages: totalPages,
                                        currentPage: pageNum
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }
    })
});

//Find by category
router.get("/categories", async (req, res) => {
    var category = req.query.category;
    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

    await Product.countDocuments({}, (err, totalCount) => {
        if(err) {
            console.log("Error while counting total products");
        } else {
            Product.find({status: true, categories: category}, null, query, (err, products) => {
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
                                    var totalPages = Math.ceil(totalCount / size);
                                    res.status(200).render('./home/products', {
                                        user: req.user,
                                        products: products,
                                        categories: categories,
                                        tags: tags,
                                        pages: totalPages,
                                        currentPage: pageNum
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }
    })
})

//Find by tag
router.get("/tags", async (req, res) => {
    var tag = req.query.tag;
    var pageNum = parseInt(req.query.pageNum);
    var size = parseInt(req.query.size);
    var query = {};

    query.skip = size * (pageNum - 1);
    query.limit = size;

    await Product.countDocuments({}, (err, totalCount) => {
        if(err) {
            console.log("Error while counting total products");
        } else {
            Product.find({status: true, tags: tag}, null, query, (err, products) => {
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
                                    var totalPages = Math.ceil(totalCount / size);
                                    res.status(200).render('./home/products', {
                                        user: req.user,
                                        products: products,
                                        categories: categories,
                                        tags: tags,
                                        pages: totalPages,
                                        currentPage: pageNum
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }
    })
})

module.exports = router;
