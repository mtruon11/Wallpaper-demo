const express = require('express');
const router = express.Router();

module.exports = router;

router.use('/', (req, res, next) => {
    if(req.user.role == 'Employee' || req.user.role == 'Admin'){
        next();
    } else {
        req.logout();
        res.status(401).send('Access Denied');
    }
});
router.use('/product', require('./product.js'));
router.use('/categories', require('./category.js'));
router.use('/tags', require('./tag.js'));
router.use('/vendors', require('./vendor.js'));
router.use('/employees', require('./employee.js'));

// DashBoard
router.get('/', (req, res) => 
    res.status(200).render('./admin/dashboard', {
        user: req.user
    })
);










