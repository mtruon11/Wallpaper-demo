const express = require('express');
const router = express.Router();

// const Product = require('../../models/Product');
// const Cart = require('../../models/Cart');

router.get('/', (req, res, next) => {
    console.log(req.user);
    res.render('./home/checkout', {
        user: req.user,
        cart: req.session.cart, 
        totalPrice: req.session.cart.totalPrice
    });
})


module.exports = router;