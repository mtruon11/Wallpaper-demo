const express = require('express');
const router = express.Router();
const {uploadProduct, uploadForUser, uploadForVendor} = require('../upload');

// Load Product model
const Product = require('../../models/Product');

module.exports = router;

router.get('/', (req, res) => {
    
    Product.find({}, async (err,data) => {
        if(data){

            var total;
            var outOfStock;

            await Product
                .countDocuments({}, (err, count) => {
                    total = count;
                });

            await Product
                .countDocuments({status: false, quantity: {$eq: 0}}, (err, count) => {
                    outOfStock = count;
                });

            res.status(200).render('./admin/viewProduct', {
                user: req.user, 
                total: total,
                outOfStock: outOfStock,
                data: data,
                link: "/admin/product/"
            })
        } else {
            res.status(200).render('./admin/viewProduct', {
                user: req.user, 
                total: 0,
                outOfStock: 0,
                data: null,
                link: "/admin/product/"
            })
        }
    });
});

