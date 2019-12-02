const express = require('express');
const router = express.Router();

// Load Vendor model
const Vendor = require('../../models/Vendor');

module.exports = router;

router.get('/viewVendor', (req, res) => {

    Vendor.find({}, (err, vendors) => {
        res.status(200).render('./admin/viewVendor', {
            user: req.user,
            vendors: vendors
        })
    })
});

