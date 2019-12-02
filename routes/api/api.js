const express = require('express');
const router = express.Router();

router.use('/categories', require('./category.js'));
router.use('/tags', require('./tag.js'));
router.use('/colors', require('./color.js'));
router.use('/measurements', require('./measurement.js'));
router.use('/employees', require('./employee.js'));
router.use('/vendors', require('./vendor.js'));
// router.use('/customers', require('./customer.js'));
// router.use('/customers', require('./customer.js'));
router.use('/products', require('./product.js'));
router.use('/filter', require('./filter.js'));
module.exports = router;









