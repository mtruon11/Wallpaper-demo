const express = require('express');
const router = express.Router();

router.use('/product', require('./product.js'));
router.use('/categories', require('./category.js'));
router.use('/tags', require('./tag.js'));
router.use('/vendors', require('./vendor.js'));
router.use('/employees', require('./employee.js'));
router.use('/orders', require('./order.js'));

// DashBoard
router.get('/', (req, res) => {
    res.status(200).render('./admin/dashboard', {
        user: req.user
    })
});

module.exports = router;









