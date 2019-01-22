const express = require('express');
const router = express.Router();
const {stripeSecretKey} = require('../../config/keys');
const csrf = require('csurf');

const csrfProtection = csrf();

const Cart = require('../../models/Cart');
const Order = require('../../models/Order');

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

router.post('/updateCreditCard', (req, res, next) => {
    res.send('Credit card is updated');
})

router.post('/placeOrder', (req, res, next) => {
    if(!req.session.cart) {
        return res.redirect('/products');
    }
    
    var cart = new Cart(req.session.cart);

    var stripe = require('stripe')(stripeSecretKey);

    stripe.charges.create({
        amount: cart.totalPrice * 0.06 * 100,
        currency: "usd",
        source: req.body.stripeToken,
        description: "Test Charge"
    }, (err, charge) => {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        } else {
            var order = new Order({
                user: req.user,
                cart: cart,
                address: req.body.address,
                name: req.body.name,
                paymentId: charge.id
            });
            order.save((err, result) => {
                req.flash('success', 'Successfully bought product!');
                req.session.cart = null;
                res.redirect('/');
            })
        }
    })
})


module.exports = router;