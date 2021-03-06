const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const {ensureLoggedIn} = require('connect-ensure-login');
const csrfProtection = csrf();

const Cart = require('../../models/Cart');
const Order = require('../../models/Order');

router.get('/', ensureLoggedIn('/users/login'), csrfProtection, (req, res, next) => {
    var cart = new Cart(req.session.cart);
    
    res.render('./home/checkout', {
        user: req.user,
        cart: cart,
        products: cart.generateArray(),
        totalQty: cart.totalQty, 
        totalPrice: cart.totalPrice,
        tax: cart.totalPrice * 0.06,
        afterTax: cart.totalPrice + cart.totalPrice * 0.06, 
        shippingPrice: 0.00,
        csrfToken: req.csrfToken()
    });
})

router.post('/', ensureLoggedIn('/users/login'), (req, res, next) => {
    if(!req.session.cart) {
        return res.redirect('/products');
    }
    
    
    var stripe = require('stripe')(process.env.STRIPE_SECRET);
    
    const {stripeToken, name, shippingAddress, city, state, country, zip} = req.body;
    
    var cart = new Cart(req.session.cart);

    stripe.charges.create({
        amount: cart.totalPrice * 100 + cart.totalPrice * 0.06 * 100, 
        currency: "usd",
        source: stripeToken,
        description: "Test Charge"
    }, (err, charge) => {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout');
        } else {
        
            var order = new Order({
                name: name,
                user: req.user._id,
                cart: cart,
                shippingAddress: (shippingAddress + ' ' + city + ' ' + state + ' ' + country + ' ' + zip),
                total: (cart.totalPrice + cart.totalPrice * 0.06),
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