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
router.get('/:id', (req, res) => {

    Product.findById(req.params.id, (err, product) => {
        if(err) {
            console.log('Error while loading product')
        } else {
            console.log(product.categories);
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
router.get('/onSale', (req, res) => {
    Product.find({status: true}, (err, products) => {
        if(err){
            console.log('Error while loading products')
        } else {
            res.status(200).render('./home/products', {
                user: req.user,
                products: shuffle(products)
            })
        }
    });
});

module.exports = router;
