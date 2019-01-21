const express = require('express');
const router = express.Router();

const Product = require('../../models/Product');
const Cart = require('../../models/Cart');

//View Cart

router.get('/viewCart', (req, res, next) => {

    if(!req.session.cart){
        return res.render('./home/cart', {products: null})
    }
    var cart = new Cart(req.session.cart);
    res.render('./home/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
})

//Add to cart
router.get('/addToCart/:id', (req, res) => {
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

module.exports = router;