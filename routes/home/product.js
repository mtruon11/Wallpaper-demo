const express = require('express');
const router = express.Router();

//Load Product model
const Product = require('../../models/Product');

//All Available Products
router.get('/', (req, res) => {
    Product.find({status: true}, (err, products) => {
        if(err){
            console.log('Error while loading products')
        } else {
            res.status(200).render('./home/products', {
                user: req.user,
                products: products
            })
        }
    });

});

//Specific Product
router.get('/:id', (req, res) => {

    Product.findById(req.params.id, (err, product) => {
        if(err) {
            console.log('Error while loading product')
        } else {
            res.status(200).render('./home/product-detail', {
                user: req.user,
                product: product
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
