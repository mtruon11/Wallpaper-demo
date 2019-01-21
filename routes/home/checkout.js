const express = require('express');
const router = express.Router();
const csrf = require('csurf');

const csrfProtection = csrf();

const Cart = require('../../models/Cart');

router.get('/', csrfProtection, (req, res, next) => {
    var cart = new Cart(req.session.cart);
    res.render('./home/checkout', {
        user: req.user,
        cart: cart,
        products: cart.generateArray(),
        totalQty: cart.totalQty, 
        totalPrice: cart.totalPrice,
        csrfToken: req.csrfToken()
    });
})


module.exports = router;