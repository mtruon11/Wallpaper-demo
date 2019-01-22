const express = require('express');
const router = express.Router();
const {stripeSecretKey} = require('../../config/keys');
const csrf = require('csurf');
const {ensureLoggedIn} = require('connect-ensure-login');
const csrfProtection = csrf();

const Cart = require('../../models/Cart');
const Order = require('../../models/Order');

router.get('/', ensureLoggedIn('/users/login'), csrfProtection, (req, res, next) => {
    var cart = new Cart(req.session.cart);
    console.log(req.user);
    res.render('./home/checkout', {
        user: req.user,
        cart: cart,
        products: cart.generateArray(),
        totalQty: cart.totalQty, 
        totalPrice: cart.totalPrice,
        csrfToken: req.csrfToken()
    });
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
                name: req.body.cardName,
                customerID: req.user._id,
                cart: cart,
                shippingAddress: req.body.shippingAddress,
                total: cart.totalPrice * 0.06 * 100,
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