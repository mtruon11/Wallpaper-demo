const express = require('express');
const router = express.Router();
const shuffle = require('shuffle-array');

//Load Product model
const Product = require('../../models/Product');

//Load Cart model
const Cart = require('../../models/Cart');

//All Available Products
router.get('/', (req, res) => {
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

//Add to cart
router.get('/:id/addToCart', (req, res) => {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, (err, product) => {
        if (err) {
            return res.status(400).send('Bad Request');
        }
        cart.add(product, product._id);
        req.session.cart = cart;
        console.log(req.session.cart)
        res.redirect('/products');
    })
})


//Sale
router.get('/onSale', (req, res) => res.render('./home/products'));

module.exports = router;
