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
    res.render('./home/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty});
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
        res.redirect('/products');
    })
})

//remove
router.get('/remove/:id', (req, res) => {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart);
    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart/viewCart');
})

//update
router.get('/update', (req, res) => {
    var {id, qty} = req.query;
    var cart = new Cart(req.session.cart);
    if(parseInt(qty) <= 0){
        cart.remove(id);
    } else {
        cart.update(parseInt(qty), id);
    }
    if(cart.totalQty == 0){
        req.session.cart=null    
    } else {
        req.session.cart = cart;
    }
    res.redirect('/cart/viewCart');
})

module.exports = router;